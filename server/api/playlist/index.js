const { addSongPlaylist } = require("./addSongPlaylist");
const { getMyPlaylists } = require("./getMyPlaylists");
const { getPlaylistsongs } = require("./getPlaylistsongs");
const { removeSongPlaylist } = require("./removeSongPlaylist");

module.exports = {
	addSongPlaylist,
	getMyPlaylists,
	getPlaylistsongs,
	removeSongPlaylist,
};
