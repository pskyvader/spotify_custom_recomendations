const { getRecentlyPlayedSongs } = require("./getRecentlyPlayedSongs");
const { getRecommendedSongs } = require("./getRecommendedSongs");
const {
	getRecommendedSongsToRemove,
} = require("./getRecommendedSongsToRemove");
const { getDeletedSongs } = require("./getDeletedSongs");
const { getRecentlyAddedSongs } = require("./getRecentlyAddedSongs");
const { getRepeatedSongs } = require("./getRepeatedSongs");

module.exports = {
	getRecentlyPlayedSongs,
	getRecommendedSongs,
	getRecommendedSongsToRemove,
	getDeletedSongs,
	getRecentlyAddedSongs,
	getRepeatedSongs,
};
