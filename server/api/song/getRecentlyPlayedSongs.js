const { Op } = require("sequelize");
const { Song } = require("../../database");
const getRecentlyPlayedSongs = async (user, date = 0,limit=null) => {

	const options={
			where: {
				played_date: { [Op.gte]: date },
			},
			order: [["played_date", "DESC"]],
			include: [Song],

			// raw: true,
			// nest: true,
		}
	if (Number.isInteger(limit)){
		options.limit=limit;
	}
	return user
		.getUserSongHistories(options)
		.catch((err) => {
			return { error: true, message: err.message };
		});
};

module.exports = { getRecentlyPlayedSongs };
