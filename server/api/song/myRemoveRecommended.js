const { getPlaylistSongs } = require("./getPlaylistSongs");
const { myRecentSongs } = require("./myRecentSongs");
const { getUser } = require("../../model");
const { subtractById } = require("../../utils");

const removerecommended = {};

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
	if (removerecommended[playlistId]) {
		return removerecommended[playlistId];
	}

	const currentPlaylist = await getPlaylistSongs(access_token, playlistId);
	if (currentPlaylist.error) {
		return currentPlaylist;
	}

	const recentSongs = await myRecentSongs(access_token, currentUser.id);
	if (recentSongs.error) {
		return recentSongs;
	}
	return subtractById(currentPlaylist, recentSongs);
};

module.exports = {
	myRemoveRecommended,
	addSongRemoveRecommendedCache,
	removeSongRemoveRecommendedCache,
};
