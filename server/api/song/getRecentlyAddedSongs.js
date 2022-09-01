const { Op } = require("sequelize");

//one week in ms
const week = 604800000;

const getRecentlyAddedSongs = async (playlist) => {
	return playlist
		.getSongs({
			where: {
				song_added: {
					[Op.gte]: Date.now() - 2 * week,
				},
			},
			order: [["song_added", "ASC"]],
			// raw: true,
			// nest: true,
		})
		.catch((err) => {
			return { error: err.message };
		});
};

module.exports = { getRecentlyAddedSongs };
