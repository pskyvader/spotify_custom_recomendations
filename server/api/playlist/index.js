const { addSongToPlaylistFromAPI } = require("./addSongToPlaylistFromAPI");
const { addSongToPlaylist } = require("./addSongToPlaylist");
const { getPlaylistsFromAPI } = require("./getPlaylistsFromAPI");
const {
	removeSongFromPlaylistFromAPI,
} = require("./removeSongFromPlaylistFromAPI");

module.exports = {
	addSongToPlaylistFromAPI,
	addSongToPlaylist,
	getPlaylistsFromAPI,
	removeSongFromPlaylistFromAPI,
};
