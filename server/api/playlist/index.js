const { addSongToPlaylist } = require("./addSongToPlaylist");
const { getPlaylistsFromAPI } = require("./getPlaylistsFromAPI");
const {
	removeSongFromPlaylistFromAPI,
} = require("./removeSongFromPlaylistFromAPI");

module.exports = {
	addSongToPlaylist,
	getPlaylistsFromAPI,
	removeSongFromPlaylistFromAPI,
};
