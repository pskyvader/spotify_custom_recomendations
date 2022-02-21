const { addSongPlaylist } = require("./addSongPlaylist");
const { getMyPlaylists } = require("./getMyPlaylists");
const { getPlaylistSongs } = require("./getPlaylistSongs");
const { removeSongPlaylist } = require("./removeSongPlaylist");

module.exports = {
	addSongPlaylist,
	getMyPlaylists,
	getPlaylistSongs,
	removeSongPlaylist,
};
