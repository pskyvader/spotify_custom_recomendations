const { addToPlaylist } = require("./addToPlaylist");
const { deleteOldRemoved } = require("./deleteOldRemoved");
const { deleteUnlinkedSongs } = require("./deleteUnlinkedSongs");
const { removeFromPlaylist } = require("./removeFromPlaylist");
const { updateAverageTimes } = require("./updateAverageTimes");
const { updateRecentSongs } = require("./updateRecentSongs");
const { addMissingSongs } = require("./addMissingSongs");
const { removeMissingSongs } = require("./removeMissingSongs");
const { getHourlyTasks } = require("./getHourlyTasks");
const { getDailyTasks } = require("./getDailyTasks");

module.exports = {
	addToPlaylist,
	deleteOldRemoved,
	deleteUnlinkedSongs,
	removeFromPlaylist,
	updateAverageTimes,
	updateRecentSongs,
	addMissingSongs,
	removeMissingSongs,
	getHourlyTasks,
	getDailyTasks,
};
