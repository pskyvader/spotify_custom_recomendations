const { fn, col, Op, literal } = require("sequelize");
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
			subQuery: false,
			attributes: [
				// literal('DISTINCT ON ("Song"."id") "Song"."id"'),
				// [col("Song.id"), "Song.id"],
				// [fn("STRING_AGG", col("Song.id"), "-"), "Song.id"],
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
						[fn("sum", col("duration")), "duration"],
						[fn("STRING_AGG", col("Song.id"), "-"), "id"],
					],
					required: true,
				},
			],
			order: [
				// [col("Song.id"), "ASC"],
				[date_format, "DESC"],
			],
			group: [
				date_format,
				// col("Song.id")
			],
		})
		.catch((err) => {
			console.error(err.sql);
			return { error: true, message: err.message };
		});

	if (userSongs.error) {
		return {
			error: true,
			message: response.message.concat(userSongs.message),
		};
	}
	console.log(userSongs, userSongs[0].Song);
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
