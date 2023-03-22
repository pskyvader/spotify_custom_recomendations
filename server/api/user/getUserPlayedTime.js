const { fn, col, Op } = require("sequelize");
const { Song } = require("../../database/");
const week = 604800000;

let date_format = fn("to_char", col("played_date"), "YYYY/MM/DD");
if (process.env.PRODUCTION === "test") {
	date_format = fn("strftime", "%Y-%m-%d", col("played_date"));
}

const getUserPlayedTime = (user) => {
	return user
		.getUserSongHistories({
			raw: true,
			attributes: [
				[date_format, "played"],
				[fn("count", col("UserSongHistory.id")), "total"],
			],
			where: {
				played_date: {
					[Op.gte]: Date.now() - 4 * week,
				},
			},
			include: [
				{
					model: Song,
					attributes: [
						[fn("sum", col("duration")), "total_time"],
						// [fn("STRING_AGG", col('"Song"."id"'), "-"), "id"],
						// [col("Song.id"), "id"],
					],
				},
			],
			order: [[date_format, "DESC"]],
			group: [date_format],
		})
		.catch((err) => {
			console.error(err);
			return { error: true, message: err.message };
		});
};

module.exports = { getUserPlayedTime };
