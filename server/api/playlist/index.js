const { addSongToPlaylist } = require("./addSongToPlaylist");
const { removeSongFromPlaylist } = require("./removeSongFromPlaylist");
const { getPlaylistSongs } = require("./getPlaylistSongs");
const {
	syncronizePlaylist,
	syncronizeMultiplePlaylists,
} = require("./syncronizePlaylist");

module.exports = {
	addSongToPlaylist,
	removeSongFromPlaylist,
	getPlaylistSongs,
	syncronizePlaylist,
	syncronizeMultiplePlaylists,
};
