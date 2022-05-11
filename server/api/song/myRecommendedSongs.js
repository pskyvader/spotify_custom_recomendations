const { Op } = require("sequelize");

const { getPlaylistSongs } = require("./getPlaylistSongs");
const { myTopSongs } = require("./myTopSongs");
const { myApiRecommended } = require("./myApiRecommended");
const { getUser } = require("../../model");
const { myRecentSongs } = require("./myRecentSongs");
const { subtractById } = require("../../utils");
const { Song, UserSong } = require("../../database");

const recommended = {};
let lastGetResult = null;

//week in ms
const week = 604800000;

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

	// RecommendedSongs: get playlist songs added before 1 week ago, and played after 2 weeks ago

	const currentPlaylist = await getPlaylistSongs(session, playlistId);
	if (currentPlaylist.error) {
		return currentPlaylist;
	}

	const RecentSongs = await UserSong.findAll({
		where: {
			UserId: currentUser.id,
			song_last_played: {
				[Op.gte]: Date.now() - 2 * week,
			},
			song_added: {
				[Op.lte]: Date.now() - week,
			},
		},
		include: {
			model: Song,
		},
		raw: true,
		nest: true,
	}).catch((err) => {
		return { error: err.message };
	});
	console.log(RecentSongs);

	const RecentSongsIds = RecentSongs.map((currentSong) => {
		console.log(currentSong);
		return currentSong.id;
	});
	let RecommendedSongs = currentPlaylist.filter((currentSong) => {
		return RecentSongsIds.includes(currentSong.id);
	});

	if (RecommendedSongs.length === 0) {
		console.log(`No recommended songs for playlist ${playlistId}`);
		RecommendedSongs = await myTopSongs(access_token);
		if (RecommendedSongs.error) {
			return topSongs;
		}
	}

	const recommendedTracks = await myApiRecommended(
		access_token,
		RecommendedSongs
	);
	if (recommendedTracks.error) {
		return recommendedTracks;
	}
	recommended[playlistId] = recommendedTracks;
	lastGetResult = Date.now();
	return recommended[playlistId];
};

module.exports = {
	myRecommendedSongs,
	addSongRecommendedCache,
	removeSongRecommendedCache,
};
