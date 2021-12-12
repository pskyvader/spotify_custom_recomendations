require("dotenv").config();
const express = require("express");
const session = require("express-session");
const { authorize, pushtoken, loggedin, me,playlist } = require("./api");
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
app.use(express.static("/client/build/"));
// let the react app to handle any unknown routes
// serve up the index.html if express does'nt recognize the route
const path = require("path");

app.get("/api/:module/:submodule?", (req, res) => {
	console.log(req.params.module,req.params.submodule);
	switch (req.params.module) {
		case "authorize":
			authorize(req, res);
			break;
		case "pushtoken":
			pushtoken(req, res);
			break;
		case "me":
			me(req, res);
			break;
			case "playlists":
				playlist(req, res);
				break;
		case "loggedin":
			loggedin(req, res);
			break;
		default:
			res.json({
				message: "Hello from server!",
			});
			break;
	}
});

app.get("/login", function (req, res) {
	login(req, res);
});
app.get("/callback", function (req, res) {
	callback(req, res);
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
