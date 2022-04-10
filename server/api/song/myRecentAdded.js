const { Op } = require("sequelize");
const { Song, User } = require("../../database");
const { formatSong } = require("../../model");

const recentadded = {};
let lastGetResult = null;

const myRecentAdded = async (userId, playlistId) => {
	if (recentadded[playlistId] && lastGetResult > Date.now() - 3600000) {
		return recentadded[playlistId];
	}

	const newRecentAdded = await Song.findAll({
		// where: {
		// 	song_added: {
		// 		[Op.gte]: Date.now() - 604800000,
		// 	},
		// },
		include: {
			model: User,
			where: { id: userId },
		},
		through: {
			where: {
				song_added: {
					[Op.gte]: Date.now() - 604800000,
				},
			},
		},
		raw: true,
		nest: true,
	}).catch((err) => {
		return { error: err.message };
	});
	recentadded[playlistId] = newRecentAdded.map((currentSong) => {
		return formatSong(currentSong);
	});

	lastGetResult = Date.now();
	return recentadded[playlistId];
};

module.exports = {
	myRecentAdded,
};
