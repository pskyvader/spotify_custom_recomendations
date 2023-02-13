const { formatSong, formatSongGroup } = require("./formatSong");
const { getRecentSongs } = require("./getRecentSongs");
const { getTopSongs } = require("./getTopSongs");
const { getRandomSongs } = require("./getRandomSongs");
const { getRecommendedSongs } = require("./getRecommendedSongs");
const { getSongFeatures } = require("./getSongFeatures");

module.exports = {
	formatSong,
	formatSongGroup,
	getRecentSongs,
	getTopSongs,
	getRandomSongs,
	getRecommendedSongs,
	getSongFeatures,
};
