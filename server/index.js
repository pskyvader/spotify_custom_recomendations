require("dotenv").config();
const express = require("express");
const session = require("express-session");
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

// serve up production assets
app.use(express.static("client/build"));
// let the react app to handle any unknown routes
// serve up the index.html if express does'nt recognize the route
const path = require("path");
app.get("/api", (req, res) => {
	res.json({ message: "Hello from server!" });
});

app.get("/callback", function (req, res) {
	callback(req, res);
});

app.get("/login", function (req, res) {
	login(req, res);
});

app.get("*", (req, res) => {
	res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

// if not in production use the port 5000
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log(`Server listening on ${PORT}`);
});
