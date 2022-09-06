const { Op } = require("sequelize");

//one week in ms
const week = 604800000;

const getRecentlyAddedSongs = async (playlist) => {
	return playlist
		.getSongs({
			where: {
				add_date: {
					[Op.gte]: Date.now() - 2 * week,
				},
			},
			order: [["add_date", "ASC"]],
			// raw: true,
			// nest: true,
		})
		.catch((err) => {
			return { error: err.message };
		});
};

module.exports = { getRecentlyAddedSongs };
