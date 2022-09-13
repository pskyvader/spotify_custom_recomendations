const { Op } = require("sequelize");
const { UserSongHistory } = require("../../database");
const getRecentlyPlayedSongs = async (user, date = 0) => {
	return user
		.getSongs({
			include: [
				{
					model: UserSongHistory,
					where: {
						played_date: { [Op.gte]: date },
					},
					order: [["played_date", "DESC"]],
				},
			],

			// raw: true,
			// nest: true,
		})
		.catch((err) => {
			return { error: err.message };
		});
};

module.exports = { getRecentlyPlayedSongs };
