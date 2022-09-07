const { addToPlaylist } = require("./addToPlaylist");
const { deleteGarbage } = require("./deleteGarbage");
const { deleteUnlinkedSongs } = require("./deleteUnlinkedSongs");
const { removeFromPlaylist } = require("./removeFromPlaylist");
const { updateAverageTimes } = require("./updateAverageTimes");
const { updateRecentSongs } = require("./updateRecentSongs");
const { getHourlyTasks } = require("./getHourlyTasks");
const { getDailyTasks } = require("./getDailyTasks");

module.exports = {
	addToPlaylist,
	deleteGarbage,
	deleteUnlinkedSongs,
	removeFromPlaylist,
	updateAverageTimes,
	updateRecentSongs,
	getHourlyTasks,
	getDailyTasks,
};
