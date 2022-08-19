const { addToPlaylist } = require("./addToPlaylist");
const { deleteOldRemoved } = require("./deleteOldRemoved");
const { deleteUnlinkedSongs } = require("./deleteUnlinkedSongs");
const { removeFromPlaylist } = require("./removeFromPlaylist");
const { updateAverageTimes } = require("./updateAverageTimes");
const { updateRecentSongs } = require("./updateRecentSongs");

module.exports = {
	addToPlaylist,
	deleteOldRemoved,
	deleteUnlinkedSongs,
	removeFromPlaylist,
	updateAverageTimes,
	updateRecentSongs,
};
