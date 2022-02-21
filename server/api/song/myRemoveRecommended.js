const { getPlaylistSongs } = require("../playlist");
const { myRecentSongs } = require("./");
const deleterecommended = {};
const myRemoveRecommended = async (session, playlistId) => {
	if (deleterecommended[playlistId]) {
		return deleterecommended[playlistId];
	}

	const currentPlaylist = await getPlaylistSongs(session, playlistId);
	if (currentPlaylist.error) {
		return currentPlaylist;
	}

	const recentSongs = await MeRecently(session);
	if (recentSongs.error) {
		return recentSongs;
	}
	return subtractById(currentPlaylist, recentSongs);
};

module.exports = { myRemoveRecommended };
