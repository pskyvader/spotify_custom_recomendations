const express = require("express");
const router = express.Router();

const {
	addSongToPlaylist,
	removeSongFromPlaylist,
	getPlaylistSongs,
} = require("../api/playlist");

const {
	getRecommendedSongs,
	getRecommendedSongsToRemove,
	getDeletedSongs,
	syncronizePlaylist,
} = require("../api/song");
const { getPlaylistSongFeatures } = require("../api/songfeatures");

const { createSong, getSong } = require("../model");
const { cache } = require("../utils");

const tenMinutes = 600;

// router.use("/*", (req, res, next) => {
// 	console.log("req url:", req.baseUrl);
// 	// console.log("req user:", req.user);
// 	// console.log("req playlist:", req.playlist);
// 	next();
// });

router.get("/", async (req, res) => {
	const playlist = req.playlist;
	const cacheResponse = cache.get(`get-playlist-songs-${playlist.id}`);
	if (cacheResponse) {
		return res.json(cacheResponse);
	}
	const playlistSongs = await getPlaylistSongs(playlist);
	if (playlistSongs.error) {
		return res.json(playlistSongs);
	}
	const parsedPlaylistSongs = playlistSongs.map((song) => {
		return {
			...song.toJSON(),
			PlaylistSong: song.PlaylistSongs[0].toJSON(),
		};
	});

	cache.set(
		`get-playlist-songs-${playlist.id}`,
		parsedPlaylistSongs,
		tenMinutes
	);

	res.json(parsedPlaylistSongs);
});

router.get("/sync", async (req, res) => {
	const playlist = req.playlist;
	const user = req.user;
	if (playlist.active === false) {
		return res.json({ error: true, message: "Playlist is not active" });
	}
	const response = await syncronizePlaylist(user, playlist);
	if (response.error) {
		console.error("sync error", response);
	}
	res.json(response);
});

router.get("/status", async (req, res) => {
	const playlist = req.playlist;
	if (playlist.active === false) {
		return res.json(playlist);
	}

	const syncCache = cache.get(`get-playlist-last-sync-${playlist.id}`);
	if (syncCache) {
		return res.json(playlist);
	}
	const user = req.user;
	const syncResponse = await syncronizePlaylist(user, playlist);
	if (syncResponse.error) {
		console.error("sync error", syncResponse);
	}
	cache.set(
		`get-playlist-last-sync-${playlist.id}`,
		syncResponse.error,
		tenMinutes
	);

	res.json(playlist);
});

router.get("/activate", async (req, res) => {
	const playlist = req.playlist;
	const response = await playlist.update({ active: true });
	cache.del(`get-playlist-last-sync-${playlist.id}`);
	res.json(response);
});

router.get("/deactivate", async (req, res) => {
	const playlist = req.playlist;
	const response = await playlist.update({ active: false });
	cache.del(`get-playlist-last-sync-${playlist.id}`);
	res.json(response);
});

router.get("/recommended", async (req, res) => {
	const playlist = req.playlist;
	let response = cache.get(`get-playlist-recommended-${playlist.id}`);
	if (response && response.length > 5) {
		return res.json(response);
	}
	const user = req.user;

	const recommendedSongs = await getRecommendedSongs(user, playlist);
	if (recommendedSongs.error) {
		return res.json(recommendedSongs);
	}

	cache.set(
		`get-playlist-recommended-${playlist.id}`,
		recommendedSongs,
		tenMinutes
	);

	res.json(recommendedSongs);
});

router.get("/deleterecommended", async (req, res) => {
	const playlist = req.playlist;
	let response = cache.get(`get-playlist-deleterecommended-${playlist.id}`);
	if (response) {
		return res.json(response);
	}

	const recommendedSongsToRemove = await getRecommendedSongsToRemove(
		playlist
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
		`get-playlist-deleterecommended-${playlist.id}`,
		response,
		tenMinutes
	);

	res.json(response);
});

router.get("/deletedsongs", async (req, res) => {
	const playlist = req.playlist;
	let response = cache.get(`get-playlist-deleted-${playlist.id}`);
	if (response) {
		return res.json(response);
	}

	const deletedSongs = await getDeletedSongs(playlist);
	if (deletedSongs.error) {
		return res.json(deletedSongs);
	}

	response = deletedSongs.map((deletedSong) => {
		const songResponse = deletedSong.Song.toJSON();
		songResponse.removed_date = deletedSong.removed_date;
		return songResponse;
	});
	cache.set(`get-playlist-deleted-${playlist.id}`, response, tenMinutes);

	res.json(response);
});

router.get("/songfeatures", async (req, res) => {
	const playlist = req.playlist;
	let response = cache.get(`get-playlist-songfeatures-${playlist.id}`);
	if (response) {
		return res.json(response);
	}

	const songFeaturesList = await getPlaylistSongFeatures(playlist);
	if (songFeaturesList.error) {
		return res.json(songFeaturesList);
	}

	response = songFeaturesList.map((songFeatures) => {
		if (songFeatures.SongFeature !== null) {
			return songFeatures.SongFeature.toJSON();
		}
		return { id: songFeatures.id, data: null };
	});
	cache.set(`get-playlist-songfeatures-${playlist.id}`, response, tenMinutes);

	res.json(response);
});

router.post("/add/:songId", async (req, res) => {
	const playlist = req.playlist;
	const user = req.user;

	const song = await getSong(req.params.songId).then((currentSong) => {
		if (currentSong === null) {
			return createSong(user.access_token, req.params.songId);
		}
		return currentSong;
	});

	if (song.error) {
		return res.json(song);
	}
	const response = await addSongToPlaylist(user.access_token, playlist, song);
	if (response.error) {
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
	res.json(song.toJSON());
});

router.post("/remove/:songId", async (req, res) => {
	const playlist = req.playlist;
	const user = req.user;

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
		playlist
	);

	if (response.error) {
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
	}

	res.json(response);
});

// Importing the router
module.exports = router;
