const { getPlaylistSongs } = require("../playlist");
const { getDeletedSongs } = require("./getDeletedSongs");
const { getNostalgicSongs } = require("./getNostalgicSongs");
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

	// Restore usage of our new "Creative Search" API wrapper
	const recommendedTracks = await getRecommendedSongsAPI(
		user.access_token,
		recommendedSongs,
		fullPlaylist.length,
		user.country
	);
	// If API returns error (even after internal retries), fallback to topSongs
	const validRecommendedTracks = recommendedTracks.error ? topSongs : recommendedTracks;

	const removedSongs = await getDeletedSongs(playlist);
	const nostalgicSongs = await getNostalgicSongs(user, playlist);
	const nostalgicIds = nostalgicSongs.map((s) => s.id);

	// Combine sources: Creative Search Results + Nostalgic + Recent + Top
	// then Filter out already in playlist or deleted (unless nostalgic)
	// then Deduplicate
	// then Limit to 200
	return validRecommendedTracks
		.concat(nostalgicSongs)
		.concat(recentSongsList.slice(0, 50))
		.concat(topSongs)
		.filter(
			(currentSong) =>
				(nostalgicIds.includes(currentSong.id) ||
					!removedSongs.find((song) => song.id === currentSong.id)) &&
				!fullPlaylist.find((song) => song.id === currentSong.id)
		)
		.filter((song, index, self) =>
			index === self.findIndex((t) => t.id === song.id)
		)
		.slice(0, 200);
};

module.exports = {
	getRecommendedSongs,
};
