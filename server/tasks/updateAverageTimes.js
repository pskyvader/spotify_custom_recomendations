const { fn, col, Op } = require("sequelize");
const { UserSong, Song } = require("../database");

const week = 604800000;

const updateAverageTimes = async (user) => {
	const date_format = fn("to_char", col("song_last_played"), "YYYY/MM/DD");
	const oldRecent = await UserSong.findAll({
		attributes: [
			[col("Song.duration"), "duration"],
			[date_format, "song_last_played"],
		],
		where: {
			UserId: user.id,
			song_last_played: {
				[Op.gte]: Date.now() - 4 * week,
			},
		},
		// order: [["total_duration", "DESC"]],
		// group: [date_format],
		include: {
			model: Song,
			attributes: ["duration"],
		},
		raw: true,
		nest: true,
	}).catch((err) => {
		return { error: err.message };
	});

	const stats = {};
	oldRecent.forEach((usersong) => {
		if (!stats[usersong.song_last_played]) {
			stats[usersong.song_last_played] = { times: 0, duration: 0 };
		}
		stats[usersong.song_last_played].times += 1;
		stats[usersong.song_last_played].duration += usersong.duration;
	});

	Object.keys(stats).forEach((date) => {
		console.log(
			stats[date].duration,
			new Date(stats[date].duration).toTimeString()
		);
		stats[date].duration = new Date(stats[date].duration)
			.toTimeString()
			.split(" ")[0];
	});

	console.log(stats);
	//[average time,average number of songs]

	return stats;
};

module.exports = { updateAverageTimes };
