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
		include: {
			model: Song,
		},
		where: {
			id: userId,
			song_added: {
				[Op.gte]: Date.now() - week,
			},
		},
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
