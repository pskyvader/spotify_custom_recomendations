const { filterOutliers } = require("../utils");
const { getUserPlayedTime } = require("../api/user/");

const updateAverageTimes = async (
	user,
	response = { error: false, message: [] }
) => {
	const userSongs = await getUserPlayedTime(user);
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
