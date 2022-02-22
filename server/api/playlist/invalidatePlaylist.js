const { playlists } = require("../song/getPlaylistSongs");
const { recommended } = require("../song/myRecommendedSongs");
const { removeRecommendedResult } = require("../song/myRemoveRecommended");

const invalidatePlaylist = (playlistId, songUri) => {
	if (playlists[playlistId]) {
		delete playlists[playlistId];
	}
	if (recommended[playlistId]) {
		recommended[playlistId] = recommended[playlistId].filter(
			(song) => song.action !== songUri
		);
		if (recommended[playlistId].length < 10) {
			delete recommended[playlistId];
		}
	}

	if (removeRecommendedResult[playlistId]) {
		removeRecommendedResult[playlistId] = removeRecommendedResult[
			playlistId
		].filter((song) => song.action !== songUri);
		if (removeRecommendedResult[playlistId].length < 10) {
			delete removeRecommendedResult[playlistId];
		}
	}
	return true;
};

module.exports = { invalidatePlaylist };
