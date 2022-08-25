const { addToPlaylist } = require("./addToPlaylist");
const { deleteOldRemoved } = require("./deleteOldRemoved");
const { deleteUnlinkedSongs } = require("./deleteUnlinkedSongs");
const { removeFromPlaylist } = require("./removeFromPlaylist");
const { updateAverageTimes } = require("./updateAverageTimes");
const { updateRecentSongs } = require("./updateRecentSongs");
const { addMissingSongs } = require("./addMissingSongs");
const { removeMissingSongs } = require("./removeMissingSongs");

module.exports = {
	addToPlaylist,
	deleteOldRemoved,
	deleteUnlinkedSongs,
	removeFromPlaylist,
	updateAverageTimes,
	updateRecentSongs,
	addMissingSongs,
	removeMissingSongs,
};
