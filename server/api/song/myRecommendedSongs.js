const { getPlaylistSongs } = require("./getPlaylistSongs");
const { myTopSongs } = require("./myTopSongs");
const { myApiRecommended } = require("./myApiRecommended");
const { getUser } = require("../../model");

const recommended = {};
let lastGetResult = null;

const addSongRecommendedCache = (playlistId, song) => {
	if (recommended[playlistId]) {
		recommended[playlistId].unshift(song);
	}
};
const removeSongRecommendedCache = (playlistId, song) => {
	if (recommended[playlistId]) {
		const songindex = recommended[playlistId].findIndex(
			(currentSong) => currentSong.id === song.id
		);
		if (songindex !== -1) {
			recommended[playlistId].splice(songindex, 1);
		}
	}
};

const myRecommendedSongs = async (session, playlistId) => {
	const currentUser = await getUser(session);
	if (currentUser.error) {
		return currentUser;
	}
	const access_token = session.access_token;
	if (recommended[playlistId] && lastGetResult > Date.now() - 3600000) {
		return recommended[playlistId];
	}

	const currentPlaylist = await getPlaylistSongs(
		access_token,
		playlistId,
		currentUser.id
	);
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
	lastGetResult = Date.now();
	return recommended[playlistId];
};

module.exports = {
	myRecommendedSongs,
	addSongRecommendedCache,
	removeSongRecommendedCache,
};
