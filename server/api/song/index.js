const { getRecommendedSongsFromAPI } = require("./getRecommendedSongsFromAPI");
const { getRecentlyPlayedSongs } = require("./getRecentlyPlayedSongs");
const { getRecommendedSongs } = require("./getRecommendedSongs");
const {
	getRecommendedSongsToRemove,
} = require("./getRecommendedSongsToRemove");
const { getDeletedSongs } = require("./getDeletedSongs");
const {
	syncronizePlaylist,
	syncronizeMultiplePlaylists,
} = require("./syncronizePlaylist");
const { getRecentlyAddedSongs } = require("./getRecentlyAddedSongs");
const { getRepeatedSongs } = require("./getRepeatedSongs");

module.exports = {
	getRecommendedSongsFromAPI,
	getRecentlyPlayedSongs,
	getRecommendedSongs,
	getRecommendedSongsToRemove,
	getDeletedSongs,
	syncronizePlaylist,
	syncronizeMultiplePlaylists,
	getRecentlyAddedSongs,
	getRepeatedSongs,
};
