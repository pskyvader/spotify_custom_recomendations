const { getSong, updateSong, deleteSong } = require("./song");
const { getUser, updateUser, deleteUser } = require("./user");
const { getPlaylist, updatePlaylist, deletePlaylist } = require("./playlist");
const { getPlaylistSong, updatePlaylistSong, deletePlaylistSong, } = require("./playlistSong");


module.exports = {
	getSong, updateSong, deleteSong,
	getUser, updateUser, deleteUser,
	getPlaylist, updatePlaylist, deletePlaylist,
	getPlaylistSong,
	updatePlaylistSong,
	deletePlaylistSong,
};
