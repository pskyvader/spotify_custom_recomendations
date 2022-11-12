require("dotenv").config();
const express = require("express");
const NodeCache = require("node-cache");
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
const {
	getPlaylistsFromAPI,
	addSongToPlaylist,
	removeSongFromPlaylistFromAPI,
} = require("./api/playlist");

const {
	getPlaylistSongsFromAPI,
	getRecommendedSongs,
	getRecommendedSongsToRemove,
	getRecentlyPlayedSongs,
	getDeletedSongs,
	syncronizePlaylist,
} = require("./api/song");
const { getPlaylistSongFeatures } = require("./api/songfeatures");

const { getPlaylist, updatePlaylist, getSong } = require("./model");

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

app.get("/api/me/playlist", async (_req, res) => {
	let result = cache.get(`playlist-user-${user.id}`);
	if (!result) {
		result = await getPlaylistsFromAPI(user);
		if (!result.error) {
			result = result.map((playlist) => playlist.toJSON());
			cache.set(`playlist-user-${user.id}`, result, tenMinutes);
		}
	}
	res.json(result);
});

app.get("/api/playlist/:playlistId", async (req, res) => {
	let result = cache.get(`get-playlist-songs-${req.params.playlistId}`);
	if (!result) {
		let currentPlaylist = await getPlaylist(user, req.params.playlistId);
		result = await getPlaylistSongsFromAPI(user, currentPlaylist);
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

app.get("/api/playlist/:playlistId/sync", async (req, res) => {
	const currentPlaylist = await getPlaylist(user, req.params.playlistId);
	const result = await syncronizePlaylist(user, currentPlaylist);
	if (result.error) {
		console.error("sync error", result);
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
	if (!result.error) {
		await getPlaylist(user, req.params.playlistId).then(
			(currentPlaylist) => {
				syncronizePlaylist(user, currentPlaylist).then((syncResult) => {
					if (syncResult.error) {
						console.error("sync error", syncResult);
					}
				});
			}
		);
	}
	res.json(result);
});

app.get("/api/playlist/:playlistId/deactivate", async (req, res) => {
	const result = await updatePlaylist(req.params.playlistId, {
		active: false,
	});
	res.json(result);
});

app.get("/api/playlist/:playlistId/recommended", async (req, res) => {
	let result = cache.get(`get-playlist-recommended-${req.params.playlistId}`);
	if (!result || result.length < 5) {
		const playlist = await getPlaylist(user, req.params.playlistId);
		result = await getRecommendedSongs(user, playlist);
		if (!result.error) {
			// result = result.map((song) => song.toJSON());
			cache.set(
				`get-playlist-recommended-${req.params.playlistId}`,
				result,
				tenMinutes
			);
		}
	}

	res.json(result);
});

app.get("/api/playlist/:playlistId/deleterecommended", async (req, res) => {
	let result = cache.get(
		`get-playlist-deleterecommended-${req.params.playlistId}`
	);
	if (!result) {
		const playlist = await getPlaylist(user, req.params.playlistId);
		result = await getRecommendedSongsToRemove(playlist);
		if (!result.error) {
			result = result.map((song) => {
				const deleteSong = song.toJSON();
				deleteSong.played_date =
					song.UserSongHistories.length > 0
						? song.UserSongHistories[0].played_date
						: null;
				return deleteSong;
			});
			// console.log("delete recommended", result);
			cache.set(
				`get-playlist-deleterecommended-${req.params.playlistId}`,
				result,
				tenMinutes
			);
		}
	}

	res.json(result);
});

app.get("/api/lastplayed", async (_req, res) => {
	let result = cache.get(`get-lastplayed-${user.id}`);
	if (!result) {
		result = await getRecentlyPlayedSongs(user);
		if (!result.error) {
			result = result.map((recentSong) => {
				if (recentSong.Song === null) {
					console.log(recentSong);
				}
				const songResult = recentSong.Song.toJSON();
				songResult.played_date = recentSong.played_date;
				songResult.id = recentSong.id;
				songResult.song_id = recentSong.Song.id;
				// if (songResult.preview === null) {
				// 	console.log("No preview available", songResult);
				// }
				return songResult;
			});
			cache.set(`get-lastplayed-${user.id}`, result, tenMinutes);
		}
	}
	res.json(result);
});

app.get("/api/playlist/:playlistId/deletedsongs", async (req, res) => {
	let result = cache.get(`get-playlist-deleted-${req.params.playlistId}`);
	if (!result) {
		const playlist = await getPlaylist(user, req.params.playlistId);
		result = await getDeletedSongs(playlist);
		if (!result.error) {
			result = result.map((deletedSong) => {
				const songResult = deletedSong.Song.toJSON();
				songResult.removed_date = deletedSong.removed_date;
				// if (songResult.preview === null) {
				// 	console.log("No preview available", songResult);
				// }
				return songResult;
			});
			cache.set(
				`get-playlist-deleted-${req.params.playlistId}`,
				result,
				tenMinutes
			);
		}
	}
	res.json(result);
});

app.get("/api/playlist/:playlistId/songfeatures", async (req, res) => {
	let result = cache.get(
		`get-playlist-songfeatures-${req.params.playlistId}`
	);
	if (!result) {
		const playlist = await getPlaylist(user, req.params.playlistId);
		result = await getPlaylistSongFeatures(playlist);
		if (!result.error) {
			result = result.map((songFeatures) => {
				if (songFeatures.SongFeature !== null) {
					return songFeatures.SongFeature.toJSON();
				}
				return { id: songFeatures.id, data: null };
			});
			cache.set(
				`get-playlist-songfeatures-${req.params.playlistId}`,
				result,
				tenMinutes
			);
		}
	}
	res.json(result);
});

app.post("/api/playlist/:playlistId/add/:songId", async (req, res) => {
	const playlist = await getPlaylist(user, req.params.playlistId);
	const song = await getSong(user.access_token, req.params.songId);
	if (song.error) {
		res.json(song);
		return;
	}
	const result = await addSongToPlaylist(user, song, playlist);
	if (!result.error) {
		const cacheplaylist = cache.get(
			`get-playlist-songs-${req.params.playlistId}`
		);
		if (cacheplaylist) {
			cacheplaylist.unshift(song.toJSON());
			cache.set(
				`get-playlist-songs-${req.params.playlistId}`,
				cacheplaylist,
				tenMinutes
			);
		}
		const cacherecommended = cache.get(
			`get-playlist-recommended-${req.params.playlistId}`
		);
		if (cacherecommended) {
			const newcacherecommended = cacherecommended.filter((cachesong) => {
				return cachesong.id !== song.id;
			});
			cache.set(
				`get-playlist-recommended-${req.params.playlistId}`,
				newcacherecommended,
				tenMinutes
			);
			if (newcacherecommended.length === 0) {
				cache.del(`get-playlist-recommended-${req.params.playlistId}`);
			}
		}
		const cacheredeleted = cache.get(
			`get-playlist-deleted-${req.params.playlistId}`
		);
		if (cacheredeleted) {
			const newcacheredeleted = cacheredeleted.filter((cachesong) => {
				return cachesong.id !== song.id;
			});
			cache.set(
				`get-playlist-deleted-${req.params.playlistId}`,
				newcacheredeleted,
				tenMinutes
			);
		}
	}
	res.json(result);
});

app.post("/api/playlist/:playlistId/remove/:songId", async (req, res) => {
	const playlist = await getPlaylist(user, req.params.playlistId);
	const song = await getSong(user.access_token, req.params.songId);
	if (song.error) {
		res.json(song);
		return;
	}
	const result = await removeSongFromPlaylistFromAPI(user, song, playlist);
	if (!result.error) {
		const cacheplaylist = cache.get(
			`get-playlist-songs-${req.params.playlistId}`
		);
		if (cacheplaylist) {
			const newcacheplaylist = cacheplaylist.filter((cachesong) => {
				return cachesong.id !== song.id;
			});
			cache.set(
				`get-playlist-songs-${req.params.playlistId}`,
				newcacheplaylist,
				tenMinutes
			);
			if (newcacheplaylist.length === 0) {
				cache.del(`get-playlist-songs-${req.params.playlistId}`);
			}
		}
		const cachedeleterecommended = cache.get(
			`get-playlist-deleterecommended-${req.params.playlistId}`
		);
		if (cachedeleterecommended) {
			const newcachedeleterecommended = cachedeleterecommended.filter(
				(cachesong) => {
					return cachesong.id !== song.id;
				}
			);
			cache.set(
				`get-playlist-deleterecommended-${req.params.playlistId}`,
				newcachedeleterecommended,
				tenMinutes
			);
			if (newcachedeleterecommended.length === 0) {
				cache.del(
					`get-playlist-deleterecommended-${req.params.playlistId}`
				);
			}
		}

		const cachedeleted = cache.get(
			`get-playlist-deleted-${req.params.playlistId}`
		);

		if (cachedeleted) {
			cachedeleted.unshift(song.toJSON());
			cache.set(
				`get-playlist-deleted-${req.params.deletedId}`,
				cachedeleted,
				tenMinutes
			);
			// cache.del(`get-playlist-deleted-${req.params.playlistId}`);
		}
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
// const PORT = process.env.PORT || 5000;
const PORT = process.env.PORT || "8080";

app.listen(PORT, () => {
	console.log(`Server listening on ${PORT}`);
});
