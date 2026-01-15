require("dotenv").config();
const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const SequelizeStore = require("connect-session-sequelize")(session.Store);

const { sequelize, connection } = require("./database");
const { login, callback, automaticTasks } = require("./pages");
const {
	authorizeUser,
	validateUserLogin,
	loginCookie,
	pushToken,
	logOut,
} = require("./api/user");
const apiRoute = require("./routes/api");
const { log, error } = require("./utils/logger");

connection();
const sessionStore = new SequelizeStore({
	db: sequelize,
});

const app = express();
app.use(
	session({
		store: sessionStore,
		secret: process.env.SESSION_SECRET,
		saveUninitialized: false,
		resave: false,
	})
);

sessionStore.sync();

app.use(cookieParser(process.env.SESSION_SECRET));
app.disable("x-powered-by");

// serve up production assets
app.use(express.static("client/build")); //Serves resources from public folder

// let the react app to handle any unknown routes
// serve up the index.html if express does'nt recognize the route
const path = require("path");

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
	log("GET /tasks");
	automaticTasks().then((response) => {
		log("GET /tasks response", response);
		res.json(response);
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
const userCache = {};

app.use("/api/*", async (req, res, next) => {
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

	const user = userCache[session.hash];
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
	userCache[session.hash] = validUser;
	req.user = validUser;
	next();
});

app.use("/api", apiRoute);

app.get("*.*", (req, res) => {
	log("GET *.* (Missing Asset)", req.originalUrl);
	res.sendStatus(404);
});

app.get("*", (req, res) => {
	log("GET * (SPA Fallback)", req.originalUrl);
	res.sendFile(
		path.resolve(__dirname, "..", "client", "build", "index.html")
	);
});

// if not in production use the port 5000
// const PORT = process.env.PORT || 5000;
const PORT = process.env.PORT || "8080";

app.listen(PORT, () => {
	console.log(`Server listening on ${PORT}`);
});
