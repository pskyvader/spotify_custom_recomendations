require("dotenv").config();
const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const pgSession = require("connect-pg-simple")(session);
const { connection } = require("./database");

const { login, callback, automaticTasks } = require("./pages");

const {
	authorizeUser,
	CheckLogin,
	loginCookie,
	pushToken,
	logOut,
} = require("./api/user");
const {
	addSongPlaylist,
	getMyPlaylists,
	removeSongPlaylist,
} = require("./api/playlist");

const {
	myRecommendedSongs,
	myRemoveRecommended,
	getPlaylistSongs,
	getMyRecentSongs,
} = require("./api/song");

const { getUser, togglePlaylist, playlistStatus } = require("./model");

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
app.get("/tasks", function (req, res) {
	automaticTasks(req, res);
});

app.get("/api/logout", async function (req, res) {
	await logOut(req);
	res.json({ logout: true });
});

app.get("/api/authorize", function (req, res) {
	const result = authorizeUser(req);
	res.json(result);
});

app.get("/api/pushtoken", function (req, res) {
	const result = pushToken(req);
	res.json(result);
});

app.get("/api/loggedin", function (req, res) {
	const result = CheckLogin(req.session);
	res.json(result);
});

app.get("/api/logincookie", async (req, res) => {
	const result = await loginCookie(req);
	res.json(result);
});

app.get("/api/me", async (req, res) => {
	const result = await getUser(req.session);
	res.json(result);
});

app.get("/api/me/playlists", async (req, res) => {
	const result = await getMyPlaylists(req.session);
	res.json(result);
});

app.get("/api/playlists/get/:playlistId", async (req, res) => {
	const result = await getPlaylistSongs(req.session, req.params.playlistId);
	res.json(result);
});

app.get("/api/playlist/:playlistId/status", async (req, res) => {
	const result = await playlistStatus(req.session, req.params.playlistId);
	res.json(result);
});

app.get("/api/playlist/:playlistId/activate", async (req, res) => {
	const result = await togglePlaylist(
		req.session,
		req.params.playlistId,
		true
	);
	res.json(result);
});

app.get("/api/playlist/:playlistId/deactivate", async (req, res) => {
	const result = await togglePlaylist(
		req.session,
		req.params.playlistId,
		false
	);
	res.json(result);
});

app.get("/api/playlists/recommended/:playlistId", async (req, res) => {
	const result = await myRecommendedSongs(req.session, req.params.playlistId);
	res.json(result);
});

app.get("/api/playlists/deleterecommended/:playlistId", async (req, res) => {
	const result = await myRemoveRecommended(
		req.session,
		req.params.playlistId
	);
	res.json(result);
});
app.get("/api/playlists/lastplayed", async (req, res) => {
	const result = await getMyRecentSongs(req.session);
	res.json(result);
});

app.get("/api/actions/add/:playlistid/:songuri", async (req, res) => {
	const result = await addSongPlaylist(
		req.session,
		req.params.songuri,
		req.params.playlistid
	);
	res.json(result);
});
app.get("/api/actions/remove/:playlistid/:songuri", async (req, res) => {
	const result = await removeSongPlaylist(
		req.session,
		req.params.songuri,
		req.params.playlistid
	);
	res.json(result);
});

app.get("/api/*", (req, res) => {
	res.json({
		error: "Unknown module",
		params: req.params,
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
