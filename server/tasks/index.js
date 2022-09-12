const { addToPlaylist } = require("./addToPlaylist");
const { deleteGarbage } = require("./deleteGarbage");
const { removeFromPlaylist } = require("./removeFromPlaylist");
const { updateAverageTimes } = require("./updateAverageTimes");
const { updateRecentSongs } = require("./updateRecentSongs");
const { getHourlyTasks } = require("./getHourlyTasks");
const { getDailyTasks } = require("./getDailyTasks");

module.exports = {
	addToPlaylist,
	deleteGarbage,
	removeFromPlaylist,
	updateAverageTimes,
	updateRecentSongs,
	getHourlyTasks,
	getDailyTasks,
};
