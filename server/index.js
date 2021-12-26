require("dotenv").config();
const express = require("express");
const session = require("express-session");
const { authorize, pushtoken, loggedin, me, playlist,actions } = require("./api");
const { callback } = require("./callback");
const { login } = require("./login");
const app = express();
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		saveUninitialized: false,
		resave: false,
	})
);
app.disable("x-powered-by");

// serve up production assets
app.use(express.static(__dirname + "/client/build")); //Serves resources from public folder

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

app.get("/api/me/:submodule?", function (req, res) {
	me(req, res);
});

app.get("/api/playlists/:action?/:playlistid?", function (req, res) {
	playlist(req, res);
});


app.get("/api/actions/:module/:playlistid/:songuri", function (req, res) {
	actions(req, res);
});


app.get("/api/*", (req, res) => {
	res.json({
		error: "Unknown module",
	});
});

app.get("*", (req, res) => {
	console.log(req.params)
	res.sendFile(
		path.resolve(__dirname, "..", "client", "build","index.html")
	);
});

// if not in production use the port 5000
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log(`Server listening on ${PORT}`);
});
