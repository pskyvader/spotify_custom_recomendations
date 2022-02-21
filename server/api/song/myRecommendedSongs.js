const recommended = {};
const myRecommendedSongs = async (session, playlistId) => {
	if (recommended[playlistId]) {
		return recommended[playlistId];
	}

	const currentPlaylist = await playlistsongs(session, playlistId);
	if (currentPlaylist.error) {
		return currentPlaylist;
	}
	const topSongs = await meTop(session);
	if (topSongs.error) {
		return topSongs;
	}

	const recommendedTrack = await recommendedSongs(
		session,
		currentPlaylist,
		topSongs
	);
	if (recommendedTrack.error) {
		return recommendedTrack;
	}
	recommended[playlistId] = recommendedTrack;
	return recommended[playlistId];
};

module.exports = { myRecommendedSongs };