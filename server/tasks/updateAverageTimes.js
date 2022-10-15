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
			// logging: (sql, queryObject) => {
			// 	console.log(sql);
			// },
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
	// response.dates = 0;
	// response.total_times = 0;
	// for (const date of userSongs) {
	// 	// console.log(date.getDataValue("total"), date.getDataValue("played"));
	// 	response.dates += 1;
	// 	// response.total_times += parseInt(date.getDataValue("total"));
	// 	response.total_times += parseInt(date.total);
	// }
	// console.log(response);
	const songsTotals = userSongs.map((song) => parseInt(song.total));
	const filteredOutliers = filterOutliers(songsTotals);

	console.log(
		filteredOutliers.length,
		Math.min(...filteredOutliers),
		Math.max(...filteredOutliers),
		filteredOutliers.reduce((a, b) => a + b, 0) /
			(filteredOutliers.length || 1)
	);
	console.log(
		songsTotals.length,
		Math.min(...songsTotals),
		Math.max(...songsTotals),
		songsTotals.reduce((a, b) => a + b, 0) / (songsTotals.length || 1)
	);

	// response.average =
	// 	response.dates > 0 ? response.total_times / response.dates : 0;

	response.average =
		filteredOutliers.reduce((a, b) => a + b, 0) /
		(filteredOutliers.length || 1);

	// const _MIN_SONGS_PER_PLAYLIST = process.env.MIN_SONGS_PER_PLAYLIST;
	const _MAX_SONGS_PER_PLAYLIST = process.env.MAX_SONGS_PER_PLAYLIST;

	response.minTime = Math.floor(_MAX_SONGS_PER_PLAYLIST / response.average); //minimum days to hold a song

	response.message.push("Average time for user:");
	response.message.push(response.average);
	response.message.push("---------------");
	response.message.push("Average Dates:");
	response.message.push(
		userSongs.reduce((dates, userSong) => {
			// dates[userSong.getDataValue("played")] = userSong.getDataValue("total") + "," + convertTime(userSong.getDataValue("total_time"));
			dates[userSong.played] =
				userSong.total +
				"---" +
				convertTime(userSong["Song.total_time"]);
			return dates;
		}, {})
	);
	response.message.push("---------------");

	return response;
};

module.exports = { updateAverageTimes };
