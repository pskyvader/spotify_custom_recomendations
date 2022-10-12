const { fn, col, Op } = require("sequelize");
const { Song } = require("../database/");
const { convertTime } = require("../utils");

const week = 604800000;
const updateAverageTimes = async (
	user,
	response = { error: false, message: [] }
) => {
	let date_format = fn("to_char", col("played_date"), "YYYY/MM/DD");
	if (process.env.PRODUCTION === "test") {
		date_format = fn("strftime", "%Y-%m-%d", col("played_date"));
	}
	const userSongs = await user
		.getUserSongHistories({
			attributes: [
				[fn("count", col("UserSongHistory.id")), "total"],
				[date_format, "played"],
				[fn("sum", col("Song.duration")), "total_time"],
				// [fn("string_agg", col("Song.id"), ","), "total_ids"],
			],
			where: {
				played_date: {
					[Op.gte]: Date.now() - 4 * week,
				},
			},
			include: [
				{
					model: Song,
					// attributes: [
					// 	[fn("string_agg", col("Song.id"), "--"), "total_ids"],
					// ],
				},
			],
			order: [[date_format, "DESC"]],
			group: [date_format, [col("Song.id")]],
		})
		.catch((err) => {
			return { error: true, message: err.message };
		});

	if (userSongs.error) {
		return {
			error: true,
			message: response.message.concat(userSongs.message),
		};
	}

	console.log(JSON.stringify(userSongs));
	response.message.push("Average time for user:");
	response.dates = 0;
	response.total_times = 0;
	for (const date of userSongs) {
		// console.log(date.getDataValue("total"), date.getDataValue("played"));
		response.dates += 1;
		response.total_times += parseInt(date.getDataValue("total"));
	}
	// console.log(response);

	response.average =
		response.dates > 0 ? response.total_times / response.dates : 0;

	response.message.push(response.average);
	response.message.push("---------------");
	response.message.push("Average Dates:");
	response.message.push(
		userSongs.reduce((dates, userSong) => {
			dates[userSong.getDataValue("played")] =
				userSong.getDataValue("total") +
				"," +
				convertTime(userSong.getDataValue("total_time"));
			return dates;
		}, {})
	);
	response.message.push("---------------");

	return response;
};

module.exports = { updateAverageTimes };
