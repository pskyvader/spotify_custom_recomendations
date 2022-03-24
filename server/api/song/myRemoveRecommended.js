const { getPlaylistSongs } = require("./getPlaylistSongs");
const { myRecentAdded } = require("./myRecentAdded");
const { myRecentSongs } = require("./myRecentSongs");
const { getUser } = require("../../model");
const { subtractById } = require("../../utils");

const removerecommended = {};
let lastGetResult = null;

const addSongRemoveRecommendedCache = (playlistId, song) => {
	if (removerecommended[playlistId]) {
		removerecommended[playlistId].unshift(song);
	}
};
const removeSongRemoveRecommendedCache = (playlistId, song) => {
	if (removerecommended[playlistId]) {
		const songindex = removerecommended[playlistId].findIndex(
			(currentSong) => currentSong.id === song.id
		);
		if (songindex !== -1) {
			removerecommended[playlistId].splice(songindex, 1);
		}
	}
};

const myRemoveRecommended = async (session, playlistId) => {
	const currentUser = await getUser(session);
	if (currentUser.error) {
		return currentUser;
	}
	const access_token = session.access_token;
	if (
		removerecommended[playlistId] &&
		lastGetResult > Date.now() - 3600000
	) {
		return removerecommended[playlistId];
	}

	const currentPlaylist = await getPlaylistSongs(session, playlistId);
	if (currentPlaylist.error) {
		return currentPlaylist;
	}
	const recentAdded = await myRecentAdded(currentUser.id, playlistId);
	if (recentAdded.error) {
		return recentAdded;
	}
	const newplaylist = subtractById(currentPlaylist, recentAdded);

	const recentSongs = await myRecentSongs(access_token, currentUser.id);
	if (recentSongs.error) {
		return recentSongs;
	}
	lastGetResult = Date.now();
	removerecommended[playlistId] = subtractById(newplaylist, recentSongs);
	return removerecommended[playlistId];
};

module.exports = {
	myRemoveRecommended,
	addSongRemoveRecommendedCache,
	removeSongRemoveRecommendedCache,
};
