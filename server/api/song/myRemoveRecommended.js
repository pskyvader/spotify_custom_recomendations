const { getPlaylistSongs } = require("./getPlaylistSongs");
// const { myRecentAdded } = require("./myRecentAdded");
// const { myRecentSongs } = require("./myRecentSongs");
const { getUser } = require("../../model");
// const { subtractById } = require("../../utils");
const { Song, UserSong } = require("../../database");
const { Op } = require("sequelize");

const removerecommended = {};
let lastGetResult = null;

//week in ms
const week = 604800000;

const addSongRemoveRecommendedCache = (playlistId, song) => {
	if (removerecommended[playlistId]) {
		removerecommended[playlistId].unshift(song);
	}
};
const removeSongRemoveRecommendedCache = (playlistId, song) => {
	if (removerecommended[playlistId]) {
		const songindex = removerecommended[playlistId].findIndex(
			(currentSong) => currentSong.id === song.id
		);
		if (songindex !== -1) {
			removerecommended[playlistId].splice(songindex, 1);
		}
	}
};

const myRemoveRecommended = async (session, playlistId) => {
	const currentUser = await getUser(session);
	if (currentUser.error) {
		return currentUser;
	}
	const userId = currentUser.id;
	// const access_token = session.access_token;
	if (removerecommended[playlistId] && lastGetResult > Date.now() - 3600000) {
		return removerecommended[playlistId];
	}

	const currentPlaylist = await getPlaylistSongs(session, playlistId);
	if (currentPlaylist.error) {
		return currentPlaylist;
	}

	const currentPlaylistIds = currentPlaylist.map((song) => song.id);

	const NeverPlayedSongs = await UserSong.findAll({
		where: {
			UserId: userId,
			song_last_played: {
				[Op.eq]: null,
			},
			song_added: {
				[Op.lte]: Date.now() - 2 * week,
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

	const NeverPlayedPlaylist = NeverPlayedSongs.filter((song) =>
		currentPlaylistIds.includes(song.id)
	);
	if (NeverPlayedPlaylist.length >= 15) {
		removerecommended[playlistId] = NeverPlayedPlaylist.map(
			(NeverPlayedSong) => formatSong(NeverPlayedSong.Song)
		);
		lastGetResult = Date.now();
		return removerecommended[playlistId];
	}

	const OldPlayedSongs = await UserSong.findAll({
		where: {
			UserId: userId,
			song_last_played: {
				[Op.lte]: Date.now() - 4 * week,
			},
			song_added: {
				[Op.lte]: Date.now() - 2 * week,
			},
		},
		order: [["song_last_played", "ASC"]],
		include: {
			model: Song,
		},
		limit: 20,
		raw: true,
		nest: true,
	}).catch((err) => {
		return { error: err.message };
	});

	const OldPlayedPlaylist = OldPlayedSongs.filter((song) =>
		currentPlaylistIds.includes(song.id)
	);

	removerecommended[playlistId] = OldPlayedPlaylist.map((OldPlayedSong) =>
		formatSong(OldPlayedSong.Song)
	);
	lastGetResult = Date.now();
	return removerecommended[playlistId];

	// const recentAdded = await myRecentAdded(currentUser.id, playlistId);
	// if (recentAdded.error) {
	// 	return recentAdded;
	// }

	// const recentSongs = await myRecentSongs(access_token, currentUser.id);
	// if (recentSongs.error) {
	// 	return recentSongs;
	// }
	// const newplaylist = subtractById(currentPlaylist, recentSongs);
	// removerecommended[playlistId] = subtractById(newplaylist, recentAdded);

	// lastGetResult = Date.now();
	// return removerecommended[playlistId];
};

module.exports = {
	myRemoveRecommended,
	addSongRemoveRecommendedCache,
	removeSongRemoveRecommendedCache,
};
