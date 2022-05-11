const { Op } = require("sequelize");
const { Song, UserSong } = require("../../database");
const { getUser, formatSong } = require("../../model");

const myDeletedSongsResult = {};
let lastGetResult = null;
const addDeletedSongsCache = (playlistId, song) => {
	if (myDeletedSongsResult[playlistId]) {
		myDeletedSongsResult[playlistId].unshift(song);
	}
};
const removeDeletedSongsCache = (playlistId, song) => {
	if (myDeletedSongsResult[playlistId]) {
		const songindex = myDeletedSongsResult[playlistId].findIndex(
			(currentSong) => currentSong.id === song.id
		);
		if (songindex !== -1) {
			myDeletedSongsResult[playlistId].splice(songindex, 1);
		}
	}
};

const getMyDeletedSongs = async (session, playlistId) => {
	const currentUser = await getUser(session);
	const userId = currentUser.id;

	if (
		myDeletedSongsResult[playlistId] &&
		lastGetResult > Date.now() - 3600000
	) {
		return myDeletedSongsResult[playlistId];
	}

	const DeletedSongs = await UserSong.findAll({
		include: {
			model: Song,
		},

		where: { UserId: userId, removed: true },
		order: [["song_removed", "DESC"]],
		raw: true,
		nest: true,
	}).catch((err) => {
		return { error: err.message };
	});

	myDeletedSongsResult[playlistId] = DeletedSongs.map((currentSong) => {
		return formatSong(currentSong.Song);
	});
	lastGetResult = Date.now();
	return myDeletedSongsResult[playlistId];
};

module.exports = {
	getMyDeletedSongs,
	addDeletedSongsCache,
	removeDeletedSongsCache,
};
