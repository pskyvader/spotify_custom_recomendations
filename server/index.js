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
const { cache } = require("./utils");

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
	login(req, res);
});
app.get("/logincookie", async (req, res) => {
	const response = { loggedin: false, hash: null };
	const loggedinResponse = await loginCookie(req);
	if (!loggedinResponse.error) {
		response.loggedin = true;
		response.hash = loggedinResponse.hash;
	}
	res.json(response);
});

app.get("/logout", async function (req, res) {
	await logOut(req);
	res.json({ logout: true });
});

app.get("/callback", function (req, res) {
	callback(req, res);
});
app.get("/tasks", function (req, res) {
	automaticTasks().then((response) => {
		console.log("Task response", response);
		res.json(response);
	});
});

app.get("/authorizeuser", function (req, res) {
	const response = authorizeUser(req);
	res.json(response);
});
app.get("/pushtoken", function (req, res) {
	const response = pushToken(req);
	res.json(response);
});

const tenMinutes = 600000;
const userCache = {};

app.use("/api/*", async (req, res, next) => {
	const session = { ...req.session };
	if (session.id) {
		delete session.id;
	}

	if (!session.hash) {
		return res.json({
			error: true,
			message: "No valid user data found",
		});
	}

	const user = userCache[session.hash];
	if (user && new Date(user.expiration) > Date.now() + tenMinutes) {
		req.user = user;
		return next();
	}
	const validUser = await validateUserLogin(session);
	if (validUser === null) {
		return res.json({
			error: true,
			message: "API error at user validation",
		});
	}
	if (validUser.error) {
		return res.json(validUser);
	}
	userCache[session.hash] = validUser;
	req.user = validUser;
	next();
});

app.use("/api", apiRoute);

app.get("*.*", (req, res) => {
	res.sendStatus(404);
});

app.get("*", (req, res) => {
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
