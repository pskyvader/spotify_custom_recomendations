const { Op } = require("sequelize");

const { PlaylistSong, Playlist, Song } = require("../database");
const { request } = require("../utils");

const createPlaylistSong = async (playlist, song) => {
	return PlaylistSong.create({
		PlaylistSong_added: Date.now(),
		times_played: 1,
		removed: false,
		PlaylistSong_removed: null,
		playlist: playlist,
		song: song,
	}).catch((err) => {
		console.error(err.message);
		return { error: err.message };
	});
};

const getPlaylistSong = async (playlist, song) => {
	const currentPlaylistSong = await PlaylistSong.findOne({
		where: { PlaylistId: playlist.id, SongId: song.id },
	});
	if (currentPlaylistSong !== null) {
		return currentPlaylistSong;
	}
	return createPlaylistSong(playlist, song);
};

const updatePlaylistSong = async () => {
	return null;
};

const deletePlaylistSong = async () => {
	return null;
};

module.exports = { getPlaylistSong, updatePlaylistSong, deletePlaylistSong };
