const myRemoveRecommended = async (req) => {
	const playlistId = req.params.playlistid;
	const session = req.session;

	if (deleterecommended[playlistId]) {
		return deleterecommended[playlistId];
	}

	const currentPlaylist = await playlistsongs(session, playlistId);
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
