const express = require("express");
const router = express.Router();

const { getUserPlaylists } = require("../api/user");
const { getRecentlyPlayedSongs } = require("../api/song");
const apiRoute = require("./api.playlist");

const { cache } = require("../utils");
const tenMinutes = 600;

const playlistCache = {};

router.get("/loggedin", async function (req, res) {
	const user = req.user;
	const response = { loggedin: false, hash: null };
	if (user !== null) {
		response.loggedin = true;
		response.hash = user.hash;
	}
	res.json(response);
});

router.get("/me", async (req, res) => {
	const user = req.user;
	res.json(user);
});

router.get("/me/playlist", async (req, res) => {
	const user = req.user;
	let response = cache.get(`playlist-user-${user.id}`);
	if (!response) {
		response = await getUserPlaylists(user);
		if (!response.error) {
			response = response.map((playlist) => playlist.toJSON());
			cache.set(`playlist-user-${user.id}`, response, tenMinutes);
		}
	}
	res.json(response);
});

router.get("/lastplayed", async (req, res) => {
	const user = req.user;
	let response = cache.get(`get-lastplayed-${user.id}`);
	if (!response) {
		response = await getRecentlyPlayedSongs(user);
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
	res.json(response);
});

router.use("/playlist/:playlistId/*", async (req, res, next) => {
	const user = req.user;
	const playlistId = req.params.playlistId;
	const playlist = playlistCache[user.hash + "-" + playlistId];
	if (playlist) {
		req.playlist = playlist;
		return next();
	}
	const currentPlaylist = await user.getPlaylists({
		where: { id: playlistId },
	});
	if (currentPlaylist.length === 0) {
		return res.json({ error: true, message: "No playlist found" });
	}
	playlistCache[user.hash + "-" + playlistId] = currentPlaylist;
	req.playlist = currentPlaylist;
	next();
});

router.use("/playlist/:playlistId", apiRoute);

router.get("/*", (req, res) => {
	res.status(404).json({
		error: "Unknown module",
		params: req.params,
	});
});

// Importing the router
module.exports = router;
