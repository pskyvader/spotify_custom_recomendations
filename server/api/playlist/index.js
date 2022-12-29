const { addSongToPlaylistFromAPI } = require("./addSongToPlaylistFromAPI");
const { addSongToPlaylist } = require("./addSongToPlaylist");
const {
	removeSongFromPlaylistFromAPI,
} = require("./removeSongFromPlaylistFromAPI");

module.exports = {
	addSongToPlaylistFromAPI,
	addSongToPlaylist,
	removeSongFromPlaylistFromAPI,
};
