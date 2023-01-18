const { addSongToPlaylist } = require("./addSongToPlaylist");
const { removeSongFromPlaylist } = require("./removeSongFromPlaylist");
const { getPlaylistSongs } = require("./getPlaylistSongs");

module.exports = {
	addSongToPlaylist,
	removeSongFromPlaylist,
	getPlaylistSongs,
};
