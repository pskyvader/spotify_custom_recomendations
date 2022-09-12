require("dotenv").config();
const express = require("express");
const NodeCache = require("node-cache");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const pgSession = require("connect-pg-simple")(session);
const { connection } = require("./database");

const { login, callback, automaticTasks } = require("./pages");

const {
	authorizeUser,
	validateUserLogin,
	loginCookie,
	pushToken,
	logOut,
} = require("./api/user");
const {
	getPlaylistsFromAPI,
	addSongToPlaylist,
	removeSongFromPlaylistFromAPI,
} = require("./api/playlist");

const {
	getPlaylistSongs,
	getRecommendedSongs,
	getRecommendedSongsToRemove,
	getRecentlyPlayedSongs,
	getDeletedSongs,
	syncronizePlaylist,
} = require("./api/song");

const { getPlaylist, updatePlaylist, getSong } = require("./model");

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
app.get("/logincookie", async (req, res) => {
	let response = await loginCookie(req);
	if (response.error) {
		response.loggedin = false;
	}
	response = { loggedin: true, hash: response.hash };
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
	automaticTasks(req, res);
});

app.get("/authorizeuser", function (req, res) {
	const result = authorizeUser(req);
	res.json(result);
});
app.get("/pushtoken", function (req, res) {
	const result = pushToken(req);
	res.json(result);
});

let user = null;
const cache = new NodeCache();
const tenMinutes = 600;

app.use("/api/*", async (req, res, next) => {
	let response = await validateUserLogin(req.session);
	if (response.error) {
		res.json(response);
		return;
	}
	user = response;
	next();
});

app.get("/api/loggedin", async function (_req, res) {
	const response = { loggedin: false, hash: null };
	if (user !== null) {
		response.loggedin = true;
		response.hash = user.hash;
	}
	res.json(response);
});

app.get("/api/me", async (_req, res) => {
	res.json(user);
});

app.get("/api/me/playlists", async (_req, res) => {
	let result = cache.get(`playlists-${user.id}`);
	if (!result) {
		result = await getPlaylistsFromAPI(user);
		if (!result.error) {
			cache.set(`playlists-${user.id}`, result, tenMinutes);
		}
	}
	res.json(result);
});

app.get("/api/playlists/get/:playlistId", async (req, res) => {
	let result = cache.get(`get-playlist-songs-${req.params.playlistId}`);
	if (!result) {
		const currentPlaylist = await getPlaylist(user, req.params.playlistId);
		let synced = cache.has(`sync-playlist-songs-${req.params.playlistId}`);
		if (!synced) {
			synced = await syncronizePlaylist(user, currentPlaylist);
			if (synced.error) {
				res.json(synced);
				return;
			}
			cache.set(
				`sync-playlist-songs-${req.params.playlistId}`,
				"true",
				tenMinutes * 6
			);
		}
		result = await getPlaylistSongs(currentPlaylist);
		if (!result.error) {
			cache.set(
				`get-playlist-songs-${req.params.playlistId}`,
				result,
				tenMinutes
			);
		}
	}
	res.json(result);
});

app.get("/api/playlist/:playlistId/status", async (req, res) => {
	const result = await getPlaylist(user, req.params.playlistId);
	res.json(result);
});

app.get("/api/playlist/:playlistId/activate", async (req, res) => {
	const result = await updatePlaylist(req.params.playlistId, {
		active: true,
	});
	res.json(result);
});

app.get("/api/playlist/:playlistId/deactivate", async (req, res) => {
	const result = await updatePlaylist(req.params.playlistId, {
		active: false,
	});
	res.json(result);
});

app.get("/api/playlists/recommended/:playlistId", async (req, res) => {
	let result = cache.get(`get-playlist-recommended-${req.params.playlistId}`);
	if (!result) {
		const playlist = await getPlaylist(user, req.params.playlistId);
		result = await getRecommendedSongs(user, playlist);
		if (!result.error) {
			cache.set(
				`get-playlist-recommended-${req.params.playlistId}`,
				result,
				tenMinutes
			);
		}
	}

	res.json(result);
});

app.get("/api/playlists/deleterecommended/:playlistId", async (req, res) => {
	let result = cache.get(
		`get-playlist-deleterecommended-${req.params.playlistId}`
	);
	if (!result) {
		const playlist = await getPlaylist(user, req.params.playlistId);
		result = await getRecommendedSongsToRemove(user, playlist);
		if (!result.error) {
			cache.set(
				`get-playlist-deleterecommended-${req.params.playlistId}`,
				result,
				tenMinutes
			);
		}
	}

	res.json(result);
});

app.get("/api/playlists/lastplayed", async (_req, res) => {
	let result = cache.get(`get-lastplayed-${user.id}`);
	if (!result) {
		result = await getRecentlyPlayedSongs(user);
		if (!result.error) {
			cache.set(`get-lastplayed-${user.id}`, result, tenMinutes);
		}
	}
	res.json(result);
});

app.get("/api/playlists/deletedsongs/:playlistId", async (req, res) => {
	let result = cache.get(`get-playlist-deleted-${req.params.playlistId}`);
	if (!result) {
		const playlist = await getPlaylist(user, req.params.playlistId);
		result = await getDeletedSongs(playlist);
		if (!result.error) {
			cache.set(
				`get-playlist-deleted-${req.params.playlistId}`,
				result,
				tenMinutes
			);
		}
	}
	res.json(result);
});

app.post("/api/actions/add/:playlistId/:songId", async (req, res) => {
	const playlist = await getPlaylist(user, req.params.playlistId);
	const song = await getSong(user.access_token, req.params.songId);
	if (song.error) {
		res.json(song);
		return;
	}
	const result = await addSongToPlaylist(user, song, playlist);
	if (!result.error) {
		cache.del(`get-playlist-songs-${req.params.playlistId}`);
		cache.del(`get-playlist-recommended-${req.params.playlistId}`);
		cache.del(`get-playlist-deleted-${req.params.playlistId}`);
	}
	res.json(result);
});

app.post("/api/actions/remove/:playlistId/:songId", async (req, res) => {
	const playlist = await getPlaylist(user, req.params.playlistId);
	const song = await getSong(user.access_token, req.params.songId);
	if (song.error) {
		res.json(song);
		return;
	}
	const result = await removeSongFromPlaylistFromAPI(user, song, playlist);
	if (!result.error) {
		cache.del(`get-playlist-songs-${req.params.playlistId}`);
		cache.del(`get-playlist-deleterecommended-${req.params.playlistId}`);
		cache.del(`get-playlist-deleted-${req.params.playlistId}`);
	}
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
