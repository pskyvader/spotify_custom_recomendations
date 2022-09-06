const { Op } = require("sequelize");
const getRecentlyPlayedSongs = async (user, date = null) => {
	const played_date =
		data === null
			? {
					[Op.ne]: null,
			  }
			: { [Op.gte]: date };
	return user
		.getSongs({
			where: {
				played_date: played_date,
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
