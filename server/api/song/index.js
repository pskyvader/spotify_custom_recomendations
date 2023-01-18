const { getRecommendedSongsFromAPI } = require("./getRecommendedSongsFromAPI");
const { getRecentlyPlayedSongs } = require("./getRecentlyPlayedSongs");
const { getRecommendedSongs } = require("./getRecommendedSongs");
const {
	getRecommendedSongsToRemove,
} = require("./getRecommendedSongsToRemove");
const { getTopSongsFromAPI } = require("./getTopSongsFromAPI");
const { getDeletedSongs } = require("./getDeletedSongs");
const {
	syncronizePlaylist,
	syncronizeMultiplePlaylists,
} = require("./syncronizePlaylist");
const { getRecentlyAddedSongs } = require("./getRecentlyAddedSongs");
const { getRepeatedSongs } = require("./getRepeatedSongs");
const {
	getRecentlyPlayedSongsFromAPI,
} = require("./getRecentlyPlayedSongsFromAPI");

module.exports = {
	getRecommendedSongsFromAPI,
	getRecentlyPlayedSongs,
	getRecommendedSongs,
	getRecommendedSongsToRemove,
	getTopSongsFromAPI,
	getDeletedSongs,
	syncronizePlaylist,
	syncronizeMultiplePlaylists,
	getRecentlyAddedSongs,
	getRepeatedSongs,
	getRecentlyPlayedSongsFromAPI,
};
