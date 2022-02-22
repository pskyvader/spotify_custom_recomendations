const { getPlaylistSongs } = require("../playlist");
const { myTopSongs } = require("./myTopSongs");
const { myApiRecommended } = require("./myApiRecommended");

const recommended = {};
const myRecommendedSongs = async (access_token, playlistId) => {
	if (recommended[playlistId]) {
		return recommended[playlistId];
	}

	const currentPlaylist = await getPlaylistSongs(access_token, playlistId);
	if (currentPlaylist.error) {
		return currentPlaylist;
	}
	const topSongs = await myTopSongs(access_token);
	if (topSongs.error) {
		return topSongs;
	}

	const recommendedTrack = await myApiRecommended(
		access_token,
		currentPlaylist,
		topSongs
	);
	if (recommendedTrack.error) {
		return recommendedTrack;
	}
	recommended[playlistId] = recommendedTrack;
	return recommended[playlistId];
};

module.exports = { myRecommendedSongs, recommended };
