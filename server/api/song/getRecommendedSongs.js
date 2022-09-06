const {
	getPlaylistSongs,
	getDeletedSongs,
	getRecommendedSongsFromAPI,
	getRecentlyPlayedSongs,
	getTopSongs,
} = require(".");
//week in ms
const week = 604800000;

const getRecommendedSongs = async (user, playlist) => {
	let currentPlaylist = await getPlaylistSongs(user, playlist);
	if (currentPlaylist.error) {
		return currentPlaylist;
	}

	// Recent: get playlist songs ids and played more recently than 1 week ago
	const RecentSongs = await getRecentlyPlayedSongs(
		user,
		Date.now() - 1 * week
	);
	if (RecentSongs.error) {
		return RecentSongs;
	}
	const RecentSongsIds = RecentSongs.map((currentSong) => {
		return currentSong.SongId;
	});

	const topSongs = await getTopSongs(user);
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
			return currentPlaylist.includes(currentSong.id);
		}).reverse(),
	];

	if (recommendedSongs.length === 0) {
		console.log(
			`No recommended songs for playlist ${playlist.id}, getting top songs`
		);
		recommendedSongs = topSongs;
	}

	const recommendedTracks = await getRecommendedSongsFromAPI(
		user.access_token,
		recommendedSongs
	);
	if (recommendedTracks.error) {
		return recommendedTracks;
	}

	const removedSongs = await getDeletedSongs(playlist);
	//remove songs recently removed
	return recommendedTracks.filter((currentSong) => {
		return !removedSongs.find((song) => song.id === currentSong.id);
	});
};

module.exports = {
	getRecommendedSongs,
};
