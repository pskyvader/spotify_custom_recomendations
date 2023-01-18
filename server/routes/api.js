const express = require("express");
const router = express.Router();

const { getUserPlaylists } = require("../api/user");
const {
	addSongToPlaylist,
	removeSongFromPlaylist,
	getPlaylistSongs,
} = require("../api/playlist");

const {
	getRecommendedSongs,
	getRecommendedSongsToRemove,
	getRecentlyPlayedSongs,
	getDeletedSongs,
	syncronizePlaylist,
} = require("../api/song");
const { getPlaylistSongFeatures } = require("../api/songfeatures");

const { updatePlaylist, createSong, getSong } = require("../model");
const { cache } = require("../utils");

const tenMinutes = 600;

// Handling request using router
router.get("/", (req, res, next) => {
	res.send("This is the api");
});

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

router.get("/playlist/:playlistId", async (req, res) => {
	const playlistId = req.params.playlistId;
	const cacheResponse = cache.get(`get-playlist-songs-${playlistId}`);
	if (cacheResponse) {
		return res.json(cacheResponse);
	}
	const user = req.user;
	const currentPlaylist = await user.getPlaylists({
		where: { id: req.params.playlistId },
	});
	if (currentPlaylist.length === 0) {
		return res.json({ error: true, message: "No playlist found" });
	}

	const playlistSongs = await getPlaylistSongs(user, currentPlaylist);
	if (playlistSongs.error) {
		return res.json(playlistSongs);
	}

	cache.set(`get-playlist-songs-${playlistId}`, playlistSongs, tenMinutes);

	res.json(playlistSongs);
});

router.get("/playlist/:playlistId/sync", async (req, res) => {
	const user = req.user;
	const currentPlaylist = await user.getPlaylists({
		where: { id: req.params.playlistId },
	});
	if (currentPlaylist.length === 0) {
		return res.json({ error: true, message: "No playlist found" });
	}

	const response = await syncronizePlaylist(user, currentPlaylist[0]);
	if (response.error) {
		console.error("sync error", response);
	}
	res.json(response);
});

router.get("/playlist/:playlistId/status", async (req, res) => {
	const user = req.user;

	const currentPlaylist = await user.getPlaylists({
		where: { id: req.params.playlistId },
	});
	if (currentPlaylist.length === 0) {
		return res.json({ error: true, message: "No playlist found" });
	}
	res.json(currentPlaylist[0]);
});

router.get("/playlist/:playlistId/activate", async (req, res) => {
	const user = req.user;
	const response = await updatePlaylist(req.params.playlistId, {
		active: true,
	});
	if (!response.error) {
		const currentPlaylist = await user.getPlaylists({
			where: { id: req.params.playlistId },
		});
		if (currentPlaylist.length === 0) {
			return res.json({ error: true, message: "No playlist found" });
		}
		const syncResponse = await syncronizePlaylist(user, currentPlaylist[0]);
		if (syncResponse.error) {
			console.error("sync error", syncResponse);
		}
	}
	res.json(response);
});

router.get("/playlist/:playlistId/deactivate", async (req, res) => {
	const response = await updatePlaylist(req.params.playlistId, {
		active: false,
	});
	res.json(response);
});

router.get("/playlist/:playlistId/recommended", async (req, res) => {
	let response = cache.get(
		`get-playlist-recommended-${req.params.playlistId}`
	);
	if (response && response.length > 5) {
		return res.json(response);
	}
	const user = req.user;

	const currentPlaylist = await user.getPlaylists({
		where: { id: req.params.playlistId },
	});
	if (currentPlaylist.length === 0) {
		return res.json({ error: true, message: "No playlist found" });
	}
	const recommendedSongs = await getRecommendedSongs(
		user,
		currentPlaylist[0]
	);
	if (recommendedSongs.error) {
		return res.json(recommendedSongs);
	}

	cache.set(
		`get-playlist-recommended-${req.params.playlistId}`,
		recommendedSongs,
		tenMinutes
	);

	res.json(recommendedSongs);
});

router.get("/playlist/:playlistId/deleterecommended", async (req, res) => {
	let response = cache.get(
		`get-playlist-deleterecommended-${req.params.playlistId}`
	);
	if (response) {
		return res.json(response);
	}
	const user = req.user;
	const currentPlaylist = await user.getPlaylists({
		where: { id: req.params.playlistId },
	});
	if (currentPlaylist.length === 0) {
		return res.json({ error: true, message: "No playlist found" });
	}
	const recommendedSongsToRemove = await getRecommendedSongsToRemove(
		currentPlaylist[0]
	);
	if (recommendedSongsToRemove.error) {
		return res.json(recommendedSongsToRemove);
	}

	response = recommendedSongsToRemove.map((song) => {
		const deleteSong = song.toJSON();
		deleteSong.played_date =
			song.UserSongHistories.length > 0
				? song.UserSongHistories[0].played_date
				: null;
		return deleteSong;
	});
	cache.set(
		`get-playlist-deleterecommended-${req.params.playlistId}`,
		response,
		tenMinutes
	);

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

router.get("/playlist/:playlistId/deletedsongs", async (req, res) => {
	let response = cache.get(`get-playlist-deleted-${req.params.playlistId}`);
	if (response) {
		return res.json(response);
	}
	const user = req.user;

	const currentPlaylist = await user.getPlaylists({
		where: { id: req.params.playlistId },
	});
	if (currentPlaylist.length === 0) {
		return res.json({ error: true, message: "No playlist found" });
	}

	const deletedSongs = await getDeletedSongs(currentPlaylist[0]);
	if (deletedSongs.error) {
		return res.json(deletedSongs);
	}

	response = deletedSongs.map((deletedSong) => {
		const songResponse = deletedSong.Song.toJSON();
		songResponse.removed_date = deletedSong.removed_date;
		return songResponse;
	});
	cache.set(
		`get-playlist-deleted-${req.params.playlistId}`,
		response,
		tenMinutes
	);

	res.json(response);
});

router.get("/playlist/:playlistId/songfeatures", async (req, res) => {
	let response = cache.get(
		`get-playlist-songfeatures-${req.params.playlistId}`
	);
	if (response) {
		return res.json(response);
	}
	const user = req.user;

	const currentPlaylist = await user.getPlaylists({
		where: { id: req.params.playlistId },
	});
	if (currentPlaylist.length === 0) {
		return res.json({ error: true, message: "No playlist found" });
	}
	const songFeaturesList = await getPlaylistSongFeatures(currentPlaylist[0]);
	if (songFeaturesList.error) {
		return res.json(songFeaturesList);
	}

	response = songFeaturesList.map((songFeatures) => {
		if (songFeatures.SongFeature !== null) {
			return songFeatures.SongFeature.toJSON();
		}
		return { id: songFeatures.id, data: null };
	});
	cache.set(
		`get-playlist-songfeatures-${req.params.playlistId}`,
		response,
		tenMinutes
	);

	res.json(response);
});

router.post("/playlist/:playlistId/add/:songId", async (req, res) => {
	const user = req.user;
	const currentPlaylist = await user.getPlaylists({
		where: { id: req.params.playlistId },
	});
	if (currentPlaylist.length === 0) {
		return res.json({ error: true, message: "No playlist found" });
	}

	const song = await getSong(req.params.songId).then((currentSong) => {
		if (currentSong === null) {
			return createSong(user.access_token, req.params.songId);
		}
		return currentSong;
	});

	if (song.error) {
		return res.json(song);
	}
	const response = await addSongToPlaylist(
		user.access_token,
		currentPlaylist[0],
		song
	);
	if (response.error) {
		return res.json(response);
	}

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
	res.json(song.toJSON());
});

router.post("/playlist/:playlistId/remove/:songId", async (req, res) => {
	const user = req.user;
	const currentPlaylist = await user.getPlaylists({
		where: { id: req.params.playlistId },
	});
	if (currentPlaylist.length === 0) {
		return res.json({ error: true, message: "No playlist found" });
	}
	const song = await getSong(req.params.songId).then((currentSong) => {
		if (currentSong === null) {
			return createSong(user.access_token, req.params.songId);
		}
		return currentSong;
	});

	if (song.error) {
		return res.json(song);
	}
	const response = await removeSongFromPlaylist(
		user.access_token,
		song,
		currentPlaylist[0]
	);

	if (response.error) {
		return res.json(response);
	}
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

	res.json(response);
});

router.get("/*", (req, res) => {
	res.status(404).json({
		error: "Unknown module",
		params: req.params,
	});
});

// Importing the router
module.exports = router;
