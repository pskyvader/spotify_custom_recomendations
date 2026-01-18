const express = require("express");
const router = express.Router();
const { log, error } = require("../utils/logger");

const {
	addSongToPlaylist,
	removeSongFromPlaylist,
	getPlaylistSongs,
	syncronizePlaylist,
} = require("../api/playlist");

const {
	getRecommendedSongs,
	getRecommendedSongsToRemove,
	getDeletedSongs,
	getSong,
} = require("../api/song");
const { getPlaylistSongFeatures } = require("../api/songfeatures");
const { cache } = require("../utils");

const tenMinutes = 600;

// router.use("/*", (req, res, next) => {
// 	log("req url:", req.baseUrl);
// 	// log("req user:", req.user);
// 	// log("req playlist:", req.playlist);
// 	log("req params:", req.params);
// 	next();
// });

router.get("/", async (req, res) => {
	log("GET /api/playlist/:id/", req.params);
	const playlist = req.playlist;
	const cacheResponse = cache.get(`get-playlist-songs-${playlist.id}`);
	if (cacheResponse) {
		log("GET /api/playlist/:id/ response (cache)", cacheResponse);
		return res.json(cacheResponse);
	}
	const playlistSongs = await getPlaylistSongs(playlist);
	if (playlistSongs.error) {
		log("GET /api/playlist/:id/ response (error)", playlistSongs);
		return res.json(playlistSongs);
	}
	if (playlistSongs.length === 0) {
		log("GET /api/playlist/:id/ response (empty)", playlistSongs);
		return res.json(playlistSongs);
	}
	const parsedPlaylistSongs = playlistSongs.map((song) => {
		return {
			...song.toJSON(),
			PlaylistSong: song.PlaylistSong.toJSON(),
		};
	});
	cache.set(
		`get-playlist-songs-${playlist.id}`,
		parsedPlaylistSongs,
		tenMinutes
	);
	log("GET /api/playlist/:id/ response", parsedPlaylistSongs);
	res.json(parsedPlaylistSongs);
});

router.get("/sync", async (req, res) => {
	log("GET /api/playlist/:id/sync", req.params);
	const playlist = req.playlist;
	const playlistId = req.params.playlistId;
	const user = req.user;
	if (playlist.active === false) {
		log("GET /api/playlist/:id/sync response (inactive)", { error: true, message: "Playlist is not active" });
		return res.json({ error: true, message: "Playlist is not active" });
	}
	const response = await syncronizePlaylist(user, playlist);
	if (response.error) {
		error("sync error", response);
	}
	delete req.playlistCache[user.hash + "-" + playlistId];
	log("GET /api/playlist/:id/sync response", response);
	res.json(response);
});

router.get("/status", async (req, res) => {
	log("GET /api/playlist/:id/status", req.params);
	const playlist = req.playlist;
	const playlistId = req.params.playlistId;
	if (playlist.active === false) {
		log("GET /api/playlist/:id/status response (inactive)", playlist);
		return res.json(playlist);
	}

	const syncCache = cache.get(`get-playlist-last-sync-${playlist.id}`);
	if (syncCache) {
		log("GET /api/playlist/:id/status response (cache)", playlist);
		return res.json(playlist);
	}
	const user = req.user;
	const syncResponse = await syncronizePlaylist(user, playlist);
	if (syncResponse.error) {
		error("sync error", syncResponse);
	} else {
		log("sync success", syncResponse);
	}
	delete req.playlistCache[user.hash + "-" + playlistId];
	// log("sync", syncResponse);
	cache.set(
		`get-playlist-last-sync-${playlist.id}`,
		syncResponse.error,
		tenMinutes
	);

	log("GET /api/playlist/:id/status response", playlist);
	res.json(playlist);
});

router.get("/activate", async (req, res) => {
	log("GET /api/playlist/:id/activate", req.params);
	const user = req.user;
	const playlist = req.playlist;
	const response = await playlist.update({ active: true });
	cache.del(`get-playlist-last-sync-${playlist.id}`);
	cache.del(`get-playlist-songs-${playlist.id}`);
	const syncResponse = await syncronizePlaylist(user, playlist);
	if (syncResponse.error) {
		error("sync error", syncResponse);
	} else {
		log("sync success", syncResponse);
	}
	log("GET /api/playlist/:id/activate response", response);
	res.json(response);
});

router.get("/deactivate", async (req, res) => {
	log("GET /api/playlist/:id/deactivate", req.params);
	const playlist = req.playlist;
	const response = await playlist.update({ active: false });
	cache.del(`get-playlist-last-sync-${playlist.id}`);
	cache.del(`get-playlist-songs-${playlist.id}`);
	log("GET /api/playlist/:id/deactivate response", response);
	res.json(response);
});

router.get("/recommended", async (req, res) => {
	log("GET /api/playlist/:id/recommended", req.params);
	const playlist = req.playlist;
	let response = cache.get(`get-playlist-recommended-${playlist.id}`);
	if (response && response.length > 5) {
		log("GET /api/playlist/:id/recommended response (cache)", response);
		return res.json(response);
	}
	const user = req.user;

	const recommendedSongs = await getRecommendedSongs(user, playlist);
	if (recommendedSongs.error) {
		log("GET /api/playlist/:id/recommended response (error)", recommendedSongs);
		return res.json(recommendedSongs);
	}

	cache.set(
		`get-playlist-recommended-${playlist.id}`,
		recommendedSongs,
		tenMinutes
	);
	log("GET /api/playlist/:id/recommended response", recommendedSongs);
	res.json(recommendedSongs);
});

router.get("/deleterecommended", async (req, res) => {
	log("GET /api/playlist/:id/deleterecommended", req.params);
	const playlist = req.playlist;
	let response = cache.get(`get-playlist-deleterecommended-${playlist.id}`);
	if (response) {
		log("GET /api/playlist/:id/deleterecommended response (cache)", response);
		return res.json(response);
	}

	const recommendedSongsToRemove = await getRecommendedSongsToRemove(
		playlist
	);
	if (recommendedSongsToRemove.error) {
		log("GET /api/playlist/:id/deleterecommended response (error)", recommendedSongsToRemove);
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
		`get-playlist-deleterecommended-${playlist.id}`,
		response,
		tenMinutes
	);
	log("GET /api/playlist/:id/deleterecommended response", response);

	res.json(response);
});

router.get("/deletedsongs", async (req, res) => {
	log("GET /api/playlist/:id/deletedsongs", req.params);
	const playlist = req.playlist;
	const cacheResponse = cache.get(`get-playlist-deleted-${playlist.id}`);
	if (cacheResponse) {
		log("GET /api/playlist/:id/deletedsongs response (cache)", cacheResponse);
		return res.json(cacheResponse);
	}

	const deletedSongs = await getDeletedSongs(playlist);
	if (deletedSongs.error) {
		log("GET /api/playlist/:id/deletedsongs response (error)", deletedSongs);
		return res.json(deletedSongs);
	}

	const parsedDeletedSongs = deletedSongs.map((song) => {
		return {
			...song.toJSON(),
			PlaylistSong: song.PlaylistSong.toJSON(),
		};
	});

	cache.set(
		`get-playlist-deleted-${playlist.id}`,
		parsedDeletedSongs,
		tenMinutes
	);
	log("GET /api/playlist/:id/deletedsongs response", parsedDeletedSongs);
	res.json(parsedDeletedSongs);
});

router.get("/songfeatures", async (req, res) => {
	log("GET /api/playlist/:id/songfeatures (DISABLED)", req.params);
	// Audio features endpoint is deprecated by Spotify
	const response = { error: true, messages: "songfeatures (DISABLED)" };
	res.json(response);
});

router.post("/add/:songId", async (req, res) => {
	log("POST /api/playlist/:id/add/:songId", req.params);
	const playlist = req.playlist;
	const user = req.user;

	const song = await getSong(user.access_token, req.params.songId);

	if (song.error) {
		log("POST /api/playlist/:id/add/:songId response (song error)", song);
		return res.json(song);
	}
	const response = await addSongToPlaylist(user.access_token, playlist, song);
	if (response.error) {
		log("POST /api/playlist/:id/add/:songId response (add error)", response);
		return res.json(response);
	}

	const cacheplaylist = cache.get(`get-playlist-songs-${playlist.id}`);
	if (cacheplaylist) {
		cacheplaylist.unshift(song.toJSON());
		cache.set(
			`get-playlist-songs-${playlist.id}`,
			cacheplaylist,
			tenMinutes
		);
	}
	const cacherecommended = cache.get(
		`get-playlist-recommended-${playlist.id}`
	);
	if (cacherecommended) {
		const newcacherecommended = cacherecommended.filter((cachesong) => {
			return cachesong.id !== song.id;
		});
		cache.set(
			`get-playlist-recommended-${playlist.id}`,
			newcacherecommended,
			tenMinutes
		);
		if (newcacherecommended.length === 0) {
			cache.del(`get-playlist-recommended-${playlist.id}`);
		}
	}
	const cacheredeleted = cache.get(`get-playlist-deleted-${playlist.id}`);
	if (cacheredeleted) {
		const newcacheredeleted = cacheredeleted.filter((cachesong) => {
			return cachesong.id !== song.id;
		});
		cache.set(
			`get-playlist-deleted-${playlist.id}`,
			newcacheredeleted,
			tenMinutes
		);
	}
	log("POST /api/playlist/:id/add/:songId response", song.toJSON());
	res.json(song.toJSON());
});

router.post("/remove/:songId", async (req, res) => {
	log("POST /api/playlist/:id/remove/:songId", req.params);
	const playlist = req.playlist;
	const user = req.user;

	const song = await getSong(user.access_token, req.params.songId);

	if (song.error) {
		log("POST /api/playlist/:id/remove/:songId response (song error)", song);
		return res.json(song);
	}
	const response = await removeSongFromPlaylist(
		user.access_token,
		song,
		playlist
	);

	if (response.error) {
		log("POST /api/playlist/:id/remove/:songId response (remove error)", response);
		return res.json(response);
	}
	const cacheplaylist = cache.get(`get-playlist-songs-${playlist.id}`);
	if (cacheplaylist) {
		const newcacheplaylist = cacheplaylist.filter((cachesong) => {
			return cachesong.id !== song.id;
		});
		cache.set(
			`get-playlist-songs-${playlist.id}`,
			newcacheplaylist,
			tenMinutes
		);
		if (newcacheplaylist.length === 0) {
			cache.del(`get-playlist-songs-${playlist.id}`);
		}
	}
	const cachedeleterecommended = cache.get(
		`get-playlist-deleterecommended-${playlist.id}`
	);
	if (cachedeleterecommended) {
		const newcachedeleterecommended = cachedeleterecommended.filter(
			(cachesong) => {
				return cachesong.id !== song.id;
			}
		);
		cache.set(
			`get-playlist-deleterecommended-${playlist.id}`,
			newcachedeleterecommended,
			tenMinutes
		);
		if (newcachedeleterecommended.length === 0) {
			cache.del(`get-playlist-deleterecommended-${playlist.id}`);
		}
	}

	const cachedeleted = cache.get(`get-playlist-deleted-${playlist.id}`);

	if (cachedeleted) {
		cachedeleted.unshift(song.toJSON());
		cache.set(
			`get-playlist-deleted-${req.params.deletedId}`,
			cachedeleted,
			tenMinutes
		);
		log("POST /api/playlist/:id/remove/:songId response", response);
	}

	res.json(response);
});

// Importing the router
module.exports = router;
