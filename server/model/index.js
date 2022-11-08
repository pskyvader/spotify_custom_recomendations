const { getSong, updateSong, deleteSong } = require("./song");
const { getUser, updateUser, deleteUser } = require("./user");
const { getPlaylist, updatePlaylist, deletePlaylist } = require("./playlist");
const {
	getPlaylistSong,
	updatePlaylistSong,
	deletePlaylistSong,
} = require("./playlistSong");
const { createUserSong, getUserSong, deleteUserSong } = require("./userSong");
const { getSongFeatures, deleteSongFeatures } = require("./songFeatures");

module.exports = {
	getSong,
	updateSong,
	deleteSong,
	getUser,
	updateUser,
	deleteUser,
	getPlaylist,
	updatePlaylist,
	deletePlaylist,
	getPlaylistSong,
	updatePlaylistSong,
	deletePlaylistSong,
	createUserSong,
	getUserSong,
	deleteUserSong,
	getSongFeatures,
	deleteSongFeatures,
};
