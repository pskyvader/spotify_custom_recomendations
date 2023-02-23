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

	let fullPlaylist = await getPlaylistSongs(playlist);

	let currentPlaylist = await getPlaylistSongs(
		playlist,
		Date.now() - 2 * minDaysInPlaylist
	); // filter by added 2 minDaysInPlaylist ago or earlier
	if (currentPlaylist.error) return currentPlaylist;

	const RecentSongs = await getRecentlyPlayedSongs(
		user,
		Date.now() - 2 * minDaysInPlaylist
	);
	if (RecentSongs.error) return RecentSongs;

	const RecentSongsIds = RecentSongs.map(
		(currentSong) => currentSong.Song.id
	);

	const topSongs = await getTopSongs(user.access_token);
	if (topSongs.error) return topSongs;

	const topSongsIds = topSongs.map((song) => song.id);

	let recommendedSongs = [
		...currentPlaylist.filter((currentSong) =>
			topSongsIds.includes(currentSong.id)
		),
		...RecentSongsIds.filter((currentSong) =>
			fullPlaylist.includes(currentSong)
		).reverse(),
	];

	if (recommendedSongs.length === 0) {
		recommendedSongs = topSongs;
	}

	const recommendedTracks = await getRecommendedSongsAPI(
		user.access_token,
		recommendedSongs,
		fullPlaylist.length,
		country.country
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
