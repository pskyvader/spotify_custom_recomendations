const { Op } = require("sequelize");
const { Song, UserSong } = require("../../database");
const { formatSong } = require("../../model");

const recentadded = {};
let lastGetResult = null;
//one week in ms
const week = 604800000;

const myRecentAdded = async (userId, playlistId) => {
	if (recentadded[playlistId] && lastGetResult > Date.now() - 3600000) {
		return recentadded[playlistId];
	}

	const newRecentAdded = await UserSong.findAll({
		where: {
			UserId: userId,
			song_added: {
				[Op.gte]: Date.now() - 2*week,
			},
		},
		include: {
			model: Song,
		},
		order: [["song_added", "ASC"]],
		raw: true,
		nest: true,
	}).catch((err) => {
		return { error: err.message };
	});
	recentadded[playlistId] = newRecentAdded.map((currentSong) => {
		return formatSong(currentSong.Song);
	});

	lastGetResult = Date.now();
	return recentadded[playlistId];
};

module.exports = {
	myRecentAdded,
};
