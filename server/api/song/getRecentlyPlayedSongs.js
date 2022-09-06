const { Op } = require("sequelize");
const getRecentlyPlayedSongs = async (user, date = 0) => {
	return user
		.getSongs({
			where: {
				played_date: { [Op.gte]: date },
			},
			order: [["played_date", "DESC"]],
			// raw: true,
			// nest: true,
		})
		.catch((err) => {
			return { error: err.message };
		});
};

module.exports = { getRecentlyPlayedSongs };
