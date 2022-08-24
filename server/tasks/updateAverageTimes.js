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

	const stats = oldRecent.reduce((previous, current) => {
		if (!previous[current.song_last_played]) {
			previous[current.song_last_played] = { times: 0, duration: 0 };
		}
		previous[current.song_last_played].times += 1;
		previous[current.song_last_played].duration += current.duration;
		return previous;
	}, {});

	stats.forEach((stat) => {
		stat.duration = new Date(stat.duration).toLocaleString();
	});

	console.log(stats);

	return stats;
};

module.exports = { updateAverageTimes };
