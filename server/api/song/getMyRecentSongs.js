const { Op } = require("sequelize");
const getMyRecentSongs = async (playlist) => {
	return playlist
		.getSongs({
			where: {
				last_played: {
					[Op.ne]: null,
				},
			},
			order: [["last_played", "DESC"]],
			// raw: true,
			// nest: true,
		})
		.catch((err) => {
			return { error: err.message };
		});
};

module.exports = { getMyRecentSongs };
