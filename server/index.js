require("dotenv").config();
const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const pgSession = require("connect-pg-simple")(session);

const {
	authorize,
	pushtoken,
	loggedin,
	me,
	playlist,
	addSongPlaylist,
	deleteSongPlaylist,
	logincookie,
} = require("./api");
const { callback } = require("./callback");
const { login } = require("./login");
const { connection } = require("./database/connection");

connection();

const app = express();
app.use(
	session({
		store: new pgSession({
			createTableIfMissing: true,
			conObject: {
				connectionString: process.env.DATABASE_URL,
				ssl: {
					// require: true,
					rejectUnauthorized: false,
				},
			},
		}),
		secret: process.env.SESSION_SECRET,
		saveUninitialized: false,
		resave: false,
	})
);
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
app.get("/callback", function (req, res) {
	callback(req, res);
});

app.get("/api/authorize", function (req, res) {
	authorize(req, res);
});

app.get("/api/pushtoken", function (req, res) {
	pushtoken(req, res);
});

app.get("/api/loggedin", function (req, res) {
	loggedin(req, res);
});

app.get("/api/logincookie", function (req, res) {
	const result = logincookie(req, res);
	res.json(result);
});

app.get("/api/me/:submodule?", function (req, res) {
	me(req, res);
});

app.get("/api/playlists/:action?/:playlistid?", function (req, res) {
	playlist(req, res);
});

app.get("/api/actions/add/:playlistid/:songuri", function (req, res) {
	const result = addSongPlaylist(req, res);
	res.json(result);
});
app.get("/api/actions/remove/:playlistid/:songuri", function (req, res) {
	const result = removeSongPlaylist(req, res);
	res.json(result);
});

app.get("/api/*", (req, res) => {
	res.json({
		error: "Unknown module",
	});
});

app.get("*", (req, res) => {
	res.sendFile(
		path.resolve(__dirname, "..", "client", "build", "index.html")
	);
});

// if not in production use the port 5000
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log(`Server listening on ${PORT}`);
});
