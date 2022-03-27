const { myApiRecommended } = require("./myApiRecommended");
const { getMyRecentSongs } = require("./getMyRecentSongs");
const { myRecommendedSongs } = require("./myRecommendedSongs");
const { myRemoveRecommended } = require("./myRemoveRecommended");
const { getPlaylistSongs } = require("./getPlaylistSongs");
const { myTopSongs } = require("./myTopSongs");
const { getMyDeletedSongs } = require("./getMyDeletedSongs");

module.exports = {
	myApiRecommended,
	getMyRecentSongs,
	myRecommendedSongs,
	myRemoveRecommended,
	getPlaylistSongs,
	myTopSongs,
	getMyDeletedSongs,
};
