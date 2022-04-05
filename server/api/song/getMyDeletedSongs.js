const { Op } = require("sequelize");
const { Song, User } = require("../../database");
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
		const DeletedSongs = await Song.findAll({
			where: { removed: true },
			include: {
				model: User,
				where: { id: userId },
			},
			order: [["song_removed", "DESC"]],
			raw: true,
			nest: true,
		}).catch((err) => {
			return { error: err.message };
		});

		myDeletedSongsResult[playlistId] = DeletedSongs.map((currentSong) => {
			return formatSong(currentSong);
		});
		lastGetResult = Date.now();
		return myDeletedSongsResult[playlistId];
	}
};

module.exports = {
	getMyDeletedSongs,
	addDeletedSongsCache,
	removeDeletedSongsCache,
};
