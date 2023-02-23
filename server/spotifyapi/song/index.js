const { formatSong, formatSongGroup } = require("./formatSong");
const { getRecentSongs } = require("./getRecentSongs");
const { getTopSongs } = require("./getTopSongs");
const { getRecommendedSongs } = require("./getRecommendedSongs");
const { getSongFeatures } = require("./getSongFeatures");
const { getSong } = require("./getSong");

module.exports = {
	formatSong,
	formatSongGroup,
	getSong,
	getRecentSongs,
	getTopSongs,
	getRecommendedSongs,
	getSongFeatures,
};
