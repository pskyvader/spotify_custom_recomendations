const { getPlaylistSongs } = require("./getPlaylistSongs");
const { myRecentSongs } = require("./myRecentSongs");
const { getUser } = require("../../model");
const { subtractById } = require("../../utils");

const removeRecommendedResult = {};
const myRemoveRecommended = async (session, playlistId) => {
	const currentUser = await getUser(session);
	if (currentUser.error) {
		return currentUser;
	}
	const access_token = session.access_token;
	if (removeRecommendedResult[playlistId]) {
		return removeRecommendedResult[playlistId];
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

module.exports = { myRemoveRecommended, removeRecommendedResult };
