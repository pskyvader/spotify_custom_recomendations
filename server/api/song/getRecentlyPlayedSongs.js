const { Op } = require("sequelize");
const { Song } = require("../../database");
const getRecentlyPlayedSongs = async (user, date = 0) => {
	return user
		.getUserSongHistories({
			where: {
				played_date: { [Op.gte]: date },
			},
			order: [["played_date", "DESC"]],
			include: [Song],

			// raw: true,
			// nest: true,
		})
		.catch((err) => {
			return { error: err.message };
		});
};

module.exports = { getRecentlyPlayedSongs };
