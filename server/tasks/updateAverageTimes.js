const { fn, col, Op } = require("sequelize");
const { UserSong, Song } = require("../database");

const week = 604800000;

const updateAverageTimes = async (user) => {
	const response = { error: false, message: [] };
	const date_format = fn("date_format", col("song_last_played"), "%Y-%m-%d");
	const oldRecent = await UserSong.findAll({
		attributes: [
			[fn("count", col("user_songs.id")), "total"],
			[date_format, "song_last_played"],
		],
		where: {
			UserId: user.id,
			song_last_played: {
				[Op.gte]: Date.now() - 4 * week,
			},
		},
		order: [[date_format, "DESC"]],
		group: [date_format],
		include: {
			model: Song,
		},
		raw: true,
		nest: true,
	}).catch((err) => {
		return { error: err.message };
	});

	console.log(oldRecent);

	return response;
};

module.exports = { updateAverageTimes };
