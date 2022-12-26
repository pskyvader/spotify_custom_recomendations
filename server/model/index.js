const { createSong, getSong, updateSong, deleteSong } = require("./song");
const { getUser, updateUser, deleteUser } = require("./user");
const { getPlaylist, updatePlaylist, deletePlaylist } = require("./playlist");
const {
	createPlaylistSong,
	getPlaylistSong,
	updatePlaylistSong,
	deletePlaylistSong,
} = require("./playlistSong");
const { createUserSong, getUserSong, deleteUserSong } = require("./userSong");
const { getSongFeatures, deleteSongFeatures } = require("./songFeatures");

module.exports = {
	createSong,
	getSong,
	updateSong,
	deleteSong,
	getUser,
	updateUser,
	deleteUser,
	getPlaylist,
	updatePlaylist,
	deletePlaylist,
	createPlaylistSong,
	getPlaylistSong,
	updatePlaylistSong,
	deletePlaylistSong,
	createUserSong,
	getUserSong,
	deleteUserSong,
	getSongFeatures,
	deleteSongFeatures,
};
