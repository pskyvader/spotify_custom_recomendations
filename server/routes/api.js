const express = require("express");
const router = express.Router();
const { log, error } = require("../utils/logger");

const { getUserPlaylists } = require("../api/user");
const { getRecentlyPlayedSongs } = require("../api/song");
const apiRoute = require("./api.playlist");

const { cache } = require("../utils");
const tenMinutes = 600;

const playlistCache = {};

router.get("/loggedin", async function (req, res) {
	log("GET /api/loggedin");
	const user = req.user;
	const response = { loggedin: false, hash: null };
	if (user !== null) {
		response.loggedin = true;
		response.hash = user.hash;
	}
	log("GET /api/loggedin response", response);
	res.json(response);
});

router.get("/me", async (req, res) => {
	log("GET /api/me");
	const user = req.user;
	log("GET /api/me response", user);
	res.json(user);
});

router.get("/me/playlist", async (req, res) => {
	log("GET /api/me/playlist");
	const user = req.user;
	let response = cache.get(`playlist-user-${user.id}`);
	if (!response) {
		response = await getUserPlaylists(user);
		if (!response.error) {
			response = response.map((playlist) => playlist.toJSON());
			cache.set(`playlist-user-${user.id}`, response, tenMinutes);
		}
	}
	log("GET /api/me/playlist response", response);
	res.json(response);
});

router.get("/lastplayed", async (req, res) => {
	log("GET /api/lastplayed");
	const user = req.user;
	let response = cache.get(`get-lastplayed-${user.id}`);
	if (!response) {
		response = await getRecentlyPlayedSongs(user, limit=1000);
		if (!response.error) {
			response = response.map((recentSong) => {
				const songResponse = recentSong.Song.toJSON();
				songResponse.played_date = recentSong.played_date;
				songResponse.id = recentSong.id;
				songResponse.song_id = recentSong.Song.id;
				// if (songResponse.preview === null) {
				// 	console.log("No preview available", songResponse);
				// }
				return songResponse;
			});
			cache.set(`get-lastplayed-${user.id}`, response, tenMinutes);
		}
	}
	log("GET /api/lastplayed response", response);
	res.json(response);
});

router.use("/playlist/:playlistId", async (req, res, next) => {
	log("Middleware /playlist/:playlistId", req.params);
	const user = req.user;
	const playlistId = req.params.playlistId;
	const playlist = playlistCache[user.hash + "-" + playlistId];
	req.playlistCache = playlistCache;
	if (playlist) {
		req.playlist = playlist;
		return next();
	}
	const currentPlaylist = await user.getPlaylists({
		where: { id: playlistId },
	});
	if (currentPlaylist.length === 0) {
		log("Playlist not found in DB, syncing user playlists...");
		await getUserPlaylists(user);

		const retryPlaylist = await user.getPlaylists({
			where: { id: playlistId },
		});
		if (retryPlaylist.length === 0) {
			log("Middleware /playlist/:playlistId* response (error)", {
				error: true,
				message: "No playlist found",
			});
			return res.json({ error: true, message: "No playlist found" });
		}
		playlistCache[user.hash + "-" + playlistId] = retryPlaylist[0];
		req.playlist = retryPlaylist[0];
		return next();
	}
	playlistCache[user.hash + "-" + playlistId] = currentPlaylist[0];
	req.playlist = currentPlaylist[0];
	next();
});

router.use("/playlist/:playlistId", apiRoute);

router.get(/.*/, (req, res) => {
	log("GET /api/* (Unknown module)", req.params);
	const response = {
		error: "Unknown module",
		params: req.params,
	};
	log("GET /api/* response", response);
	res.status(404).json(response);
});

// Importing the router
module.exports = router;
