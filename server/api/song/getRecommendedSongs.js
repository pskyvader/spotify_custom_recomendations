const { getPlaylistSongs } = require("../playlist");
const { getDeletedSongs } = require("./getDeletedSongs");
const { getRecentlyPlayedSongs } = require("./getRecentlyPlayedSongs");
const {
	getTopSongs,
	getRecommendedSongs: getRecommendedSongsAPI,
} = require("../../spotifyapi/song");

//day in ms
const day = 86400000;

const getRecommendedSongs = async (user, playlist, minDays = null) => {
	const minDaysInPlaylist = day * (minDays && minDays > 5 ? minDays : 5);

	const [fullPlaylist, currentPlaylist, recentSongs, topSongs] =
		await Promise.all([
			getPlaylistSongs(playlist),
			getPlaylistSongs(playlist, Date.now() - 2 * minDaysInPlaylist),
			getRecentlyPlayedSongs(user, Date.now() - 1 * minDaysInPlaylist),
			getTopSongs(user.access_token),
		]);

	if (fullPlaylist.error) return fullPlaylist;
	if (currentPlaylist.error) return currentPlaylist;
	if (recentSongs.error) return recentSongs;
	if (topSongs.error) return topSongs;

	const recentSongsList = recentSongs.map((currentSong) => currentSong.Song);
	const topSongsIds = topSongs.map((song) => song.id);

	let recommendedSongs = currentPlaylist
		.filter((currentSong) => topSongsIds.includes(currentSong.id))
		.concat(recentSongsList.reverse());
	// recentSongsIds.filter((currentSong) => fullPlaylist.includes(currentSong)).reverse()

	if (recommendedSongs.length === 0) {
		recommendedSongs = topSongs;
	}

	const recommendedTracks = await getRecommendedSongsAPI(
		user.access_token,
		recommendedSongs,
		fullPlaylist.length,
		user.country
	);

	if (recommendedTracks.error) return recommendedTracks;

	const removedSongs = await getDeletedSongs(playlist);

	return recommendedTracks.filter(
		(currentSong) =>
			!removedSongs.find((song) => song.id === currentSong.id) &&
			!fullPlaylist.find((song) => song.id === currentSong.id)
	);
};

module.exports = {
	getRecommendedSongs,
};
