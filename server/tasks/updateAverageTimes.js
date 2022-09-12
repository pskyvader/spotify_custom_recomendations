const { fn, col, Op } = require("sequelize");
// const { convertTime } = require("../utils");

const week = 604800000;
const updateAverageTimes = async (user) => {
	const date_format = fn("to_char", col("played_date"), "YYYY/MM/DD");
	const userSongs = await user
		.getSongs({
			attributes: [
				[fn("count", col("id")), "total"],
				[fn("sum", col("Song.duration")), "duration"],
				[date_format, "played_date"],
			],
			where: {
				played_date: {
					[Op.gte]: Date.now() - 4 * week,
				},
			},
			order: [[date_format, "DESC"]],
			group: [date_format],

			// raw: true,
			// nest: true,
		})
		.catch((err) => {
			return { error: err.message };
		});

	// const stats = {};
	// oldRecent.forEach((usersong) => {
	// 	if (!stats[usersong.song_last_played]) {
	// 		stats[usersong.song_last_played] = { times: 0, duration: 0 };
	// 	}
	// 	stats[usersong.song_last_played].times += usersong.times_played;
	// 	stats[usersong.song_last_played].duration += usersong.duration;
	// });

	const response = { dates: 0, total_times: 0, total_duration: 0 };
	for (const date of userSongs) {
		response.dates += 1;
		response.total_times += date.total;
		response.total_duration += date.duration;
	}
	// Object.keys(oldRecent).forEach((date) => {
	// 	stats[date].duration_text = convertTime(stats[date].duration);
	// 	response.dates += 1;
	// 	response.total_times += stats[date].times;
	// 	response.total_duration += stats[date].duration;
	// });

	console.log(stats);
	//[average time,average number of songs]

	response.average =
		response.dates > 0 ? response.total_times / response.dates : 0;

	return response;
};

module.exports = { updateAverageTimes };
