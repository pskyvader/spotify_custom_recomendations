const { fn, col, Op } = require("sequelize");
const { UserSong, Song } = require("../database");

const week = 604800000;

const updateAverageTimes = async (user) => {
	const response = { error: false, message: [] };
	const date_format = fn("to_char", col("song_last_played"), "YYYY/MM/DD");
	const oldRecent = await UserSong.findAll({
		attributes: [
			[fn("count", col("times_played")), "total"],
			[fn("sum", col("Song.duration")), "total_duration"],
			[date_format, "song_last_played"],
		],
		where: {
			UserId: user.id,
			song_last_played: {
				[Op.gte]: Date.now() - 4 * week,
			},
		},
		// order: [["total_duration", "DESC"]],
		group: [date_format],
		// include: {
		// 	model: Song,
		// 	attributes: ["duration"],
		// },
		raw: true,
		nest: true,
	}).catch((err) => {
		return { error: err.message };
	});

	console.log(oldRecent);

	return response;
};

module.exports = { updateAverageTimes };
