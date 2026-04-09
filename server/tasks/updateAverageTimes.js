const { filterOutliers } = require("../utils");
const { getUserPlayedTime } = require("../api/user/");
const { log, info, error } = require("../utils/logger");

const updateAverageTimes = async (
	user,
	response = { error: false }
) => {
	try {
		log("Fetching user played time data", { userId: user.id });

		const userSongs = await getUserPlayedTime(user);

		if (userSongs.error) {
			error("Failed to get user played time", {
				userId: user.id,
				error: userSongs,
			});
			return {
				error: true,
			};
		}

		log("Processing song time data", {
			userId: user.id,
			songCount: userSongs.length,
		});

		const songsTotals = userSongs.map((song) => parseInt(song.total));
		const filteredOutliers = filterOutliers(songsTotals);

		const average =
			filteredOutliers.reduce((a, b) => a + b, 0) /
			(filteredOutliers.length || 1);

		response.average = average;

		info("updateAverageTimes completed", {
			userId: user.id,
			average,
			songsProcessed: songsTotals.length,
			outlierFilteredCount: filteredOutliers.length,
		});

		return response;
	} catch (err) {
		error("updateAverageTimes failed", {
			userId: user.id,
			error: err.message,
		});
		return { error: true };
	}
};

module.exports = { updateAverageTimes };
