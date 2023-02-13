const { getPlaylistSongs } = require("../playlist");
const { getDeletedSongs } = require("./getDeletedSongs");
const { getRecentlyPlayedSongs } = require("./getRecentlyPlayedSongs");
const {
	getTopSongs,
	getRecommendedSongs: getRecommendedSongsAPI,
} = require("../../spotifyapi/song");

//day in ms
const day = 86400000;
const getRecommendedSongs = async (user, playlist, minTime = null) => {
	const minTimeInPlaylist = day * (minTime && minTime > 5 ? minTime : 5);

	let fullPlaylist = await getPlaylistSongs(playlist);

	let currentPlaylist = await getPlaylistSongs(
		playlist,
		Date.now() - 2 * minTimeInPlaylist
	); // filter by added 2 minTimeInPlaylist ago or earlier
	if (currentPlaylist.error) {
		return currentPlaylist;
	}

	// Recent: get playlist songs ids and played more recently than 2 minTimeInPlaylist ago
	const RecentSongs = await getRecentlyPlayedSongs(
		user,
		Date.now() - 2 * minTimeInPlaylist
	);
	if (RecentSongs.error) {
		return RecentSongs;
	}
	const RecentSongsIds = RecentSongs.map((currentSong) => {
		return currentSong.Song.id;
	});

	const topSongs = await getTopSongs(user.access_token);
	if (topSongs.error) {
		return topSongs;
	}

	const topSongsIds = topSongs.map((song) => song.id);

	//Recommended songs: get playlist songs in recent playlist that are in current playlist, or in top songs
	let recommendedSongs = [
		...currentPlaylist.filter((currentSong) => {
			return topSongsIds.includes(currentSong.id);
		}),
		...RecentSongsIds.filter((currentSong) => {
			return fullPlaylist.includes(currentSong.id);
		}).reverse(),
	];

	if (recommendedSongs.length === 0) {
		console.log(
			`No recommended songs for playlist ${playlist.id}, getting top songs`
		);
		recommendedSongs = topSongs;
	}

	const recommendedTracks = await getRecommendedSongsAPI(
		user.access_token,
		recommendedSongs,
		fullPlaylist.length
	);
	if (recommendedTracks.error) {
		return recommendedTracks;
	}

	const removedSongs = await getDeletedSongs(playlist);
	//remove songs recently removed and songs already in playlist
	return recommendedTracks.filter((currentSong) => {
		return (
			!removedSongs.find((song) => song.id === currentSong.id) &&
			!fullPlaylist.find((song) => song.id === currentSong.id)
		);
	});
};

module.exports = {
	getRecommendedSongs,
};
