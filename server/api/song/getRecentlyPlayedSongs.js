const { Op } = require("sequelize");
const getRecentlyPlayedSongs = async (playlist, date = null) => {
	const last_played =
		data === null
			? {
					[Op.ne]: null,
			  }
			: { [Op.gte]: date };
	return playlist
		.getSongs({
			where: {
				last_played: last_played,
			},
			order: [["last_played", "DESC"]],
			// raw: true,
			// nest: true,
		})
		.catch((err) => {
			return { error: err.message };
		});
};

module.exports = { getRecentlyPlayedSongs };
