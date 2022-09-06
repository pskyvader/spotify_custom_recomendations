const { getRecommendedSongsFromAPI } = require("./getRecommendedSongsFromAPI");
const { getRecentlyPlayedSongs } = require("./getRecentlyPlayedSongs");
const { getRecommendedSongs } = require("./getRecommendedSongs");
const {
	getRecommendedSongsToRemove,
} = require("./getRecommendedSongsToRemove");
const { getPlaylistSongs } = require("./getPlaylistSongs");
const { getTopSongsFromAPI } = require("./getTopSongsFromAPI");
const { getDeletedSongs } = require("./getDeletedSongs");
const { syncronizePlaylist } = require("./syncronizePlaylist");
const { getRecentlyAddedSongs } = require("./getRecentlyAddedSongs");
const { getRepeatedSongs } = require("./getRepeatedSongs");
const { getPlaylistSongsFromAPI } = require("./getPlaylistSongsFromAPI");

module.exports = {
	getRecommendedSongsFromAPI,
	getRecentlyPlayedSongs,
	getRecommendedSongs,
	getRecommendedSongsToRemove,
	getPlaylistSongs,
	getTopSongsFromAPI,
	getDeletedSongs,
	syncronizePlaylist,
	getRecentlyAddedSongs,
	getRepeatedSongs,
	getPlaylistSongsFromAPI,
};
