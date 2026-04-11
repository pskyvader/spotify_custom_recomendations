require("dotenv").config();
const express = require("express");
const path = require("path");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const SequelizeStore = require("connect-session-sequelize")(session.Store);

const { sequelize, connection } = require("./database");
const { login, callback, runTasksAsync, tasks_ongoingRun } = require("./pages");
const {
	authorizeUser,
	validateUserLogin,
	loginCookie,
	pushToken,
	logOut,
} = require("./api/user");
const apiRoute = require("./routes/api");
const { log, error } = require("./utils/logger");
const { memoryLoggingMiddleware, logMemorySnapshot } = require("./utils/memoryMonitor");
; (async () => {
	// Attempt DB connection and then start the server in degraded mode if DB not available
	const dbResult = await connection();

	const db = require("./database");

	const app = express();

	// session store only if DB is available
	if (db && db.dbAvailable) {
		const sessionStore = new SequelizeStore({
			db: sequelize,
		});

		app.use(
			session({
				store: sessionStore,
				secret: process.env.SESSION_SECRET,
				saveUninitialized: false,
				resave: false,
			})
		);

		try {
			sessionStore.sync();
		} catch (e) {
			console.warn("Session store sync failed, continuing without session store.", e.message || e);
		}
	} else {
		// DB not available — run with basic session (in-memory)
		app.use(
			session({
				secret: process.env.SESSION_SECRET || "dev-secret",
				saveUninitialized: false,
				resave: false,
			})
		);
		console.warn("Database unavailable — running in degraded mode (no persistent session store).");
	}

	app.use(cookieParser(process.env.SESSION_SECRET));
	app.disable("x-powered-by");

	// Add memory monitoring for all requests
	if (process.env.ENABLE_MEMORY_LOGGING === "true") {
		app.use(memoryLoggingMiddleware);
		logMemorySnapshot("Server startup complete");
	}

	// serve up production assets
	const clientBuildPath = path.resolve(__dirname, "..", "client", "build");
	const fs = require("fs");
	if (fs.existsSync(clientBuildPath)) {
		app.use(express.static("client/build")); //Serves resources from public folder
	}

	app.get("/login", function (req, res) {
		log("GET /login - Redirecting to Spotify");
		login(req, res);
	});
	app.get("/logincookie", async (req, res) => {
		log("GET /logincookie");
		const response = { loggedin: false, hash: null };
		const loggedinResponse = await loginCookie(req);
		log("GET /logincookie response", response);
		if (!loggedinResponse.error) {
			response.loggedin = true;
			response.hash = loggedinResponse.hash;
		}
		res.json(response);
	});

	app.get("/logout", async function (req, res) {
		log("GET /logout");
		await logOut(req);
		req.session.destroy((err) => {
			if (err) {
				log("Error destroying session", err);
			}
			res.clearCookie("connect.sid");
			res.json({ logout: true });
		});
	});

	app.get("/callback", function (req, res) {
		log("GET /callback", req.query);
		callback(req, res);
	});
	app.get("/tasks", function (req, res) {
		log("GET /tasks - Starting async task run");

		// Trigger async tasks
		runTasksAsync();

		// Return immediately without waiting
		res.json({
			status: "accepted",
			message: "Tasks queued for processing",
			taskId: tasks_ongoingRun.id,
			startedAt: tasks_ongoingRun.startedAt,
		});
	});

	// New endpoint: Check task status and get results
	app.get("/tasks/status", function (req, res) {
		log("GET /tasks/status - Checking task status");

		res.json({
			status: tasks_ongoingRun.status,
			taskId: tasks_ongoingRun.id,
			startedAt: tasks_ongoingRun.startedAt,
			results: tasks_ongoingRun.results,
			...(tasks_ongoingRun.status === "completed" && {
				timing: tasks_ongoingRun.results.timing,
				logs: tasks_ongoingRun.results.logs,
			}),
		});
	});

	app.get("/authorizeuser", function (req, res) {
		log("GET /authorizeuser");
		const response = authorizeUser(req);
		log("GET /authorizeuser response", response);
		res.json(response);
	});
	app.get("/pushtoken", function (req, res) {
		log("GET /pushtoken");
		const response = pushToken(req);
		log("GET /pushtoken response", response);
		res.json(response);
	});

	const tenMinutes = 600000;
	const boundedCache = require("./utils/boundedCache");

	app.use("/api", async (req, res, next) => {
		log("API Middleware Check", req.originalUrl, "Hash:", req.session.hash);
		const session = { ...req.session };
		if (session.id) {
			delete session.id;
		}

		if (!session.hash) {
			log("API Middleware: No hash found in session. Response: No valid user data found");
			return res.json({
				error: true,
				message: "No valid user data found",
			});
		}

		const cacheKey = `user-${session.hash}`;
		const user = boundedCache.get(cacheKey);
		if (user && new Date(user.expiration) > Date.now() + tenMinutes) {
			log("API Middleware: User found in cache (User ID: " + user.id + ")");
			req.user = user;
			return next();
		}
		log("API Middleware: Validating user login");
		const validUser = await validateUserLogin(session);
		if (validUser === null) {
			error("API Middleware: validateUserLogin returned null. Response: API error at user validation");
			return res.json({
				error: true,
				message: "API error at user validation",
			});
		}
		if (validUser.error) {
			error("API Middleware: Validation error", validUser, "Response:", validUser);
			return res.json(validUser);
		}
		boundedCache.set(cacheKey, validUser, 3600); // 1 hour TTL
		req.user = validUser;
		next();
	});

	app.use("/api", apiRoute);

	app.get(/.*\..*/, (req, res) => {
		log("GET *.* (Missing Asset)", req.originalUrl);
		res.sendStatus(404);
	});

	app.get(/.*/, (req, res) => {
		log("GET * (SPA Fallback)", req.originalUrl);
		const indexFile = path.resolve(__dirname, "..", "client", "build", "index.html");
		if (fs.existsSync(indexFile)) {
			res.sendFile(indexFile);
		} else {
			res.status(404).send("Client build not found");
		}
	});

	// if not in production use the port 5000
	// const PORT = process.env.PORT || 5000;
	const PORT = process.env.PORT || "8080";

	app.listen(PORT, () => {
		console.log(`Server listening on ${PORT}`);
	});
})();
