const { fn, col, Op, literal } = require("sequelize");
const { Song } = require("../database/");
const { convertTime, filterOutliers } = require("../utils");

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
			console.error(err.sql);
			return { error: true, message: err.message };
		});

	if (userSongs.error) {
		return {
			error: true,
			message: response.message.concat(userSongs.message),
		};
	}
	const songsTotals = userSongs.map((song) => parseInt(song.total));
	const filteredOutliers = filterOutliers(songsTotals);

	response.average =
		filteredOutliers.reduce((a, b) => a + b, 0) /
		(filteredOutliers.length || 1);
	response.message.push("Average time for user:");
	response.message.push(response.average);
	response.message.push("---------------");
	// response.message.push("Average Dates:");
	// response.message.push(
	// 	userSongs.reduce((dates, userSong) => {
	// 		dates[userSong.played] =
	// 			userSong.total +
	// 			"---" +
	// 			convertTime(userSong["Song.total_time"]);
	// 		return dates;
	// 	}, {})
	// );
	// response.message.push("---------------");

	return response;
};

module.exports = { updateAverageTimes };
