const { PlaylistSong } = require("../database");
const createPlaylistSong = async (playlist, song) => {
	const [newplaylistsong] = await PlaylistSong.upsert({
		add_date: Date.now(),
		removed_date: null,
		active: true,
		playlist: playlist,
		song: song,
	}).catch((err) => {
		console.error(err.message);
		return { error: err.message };
	});
	return newplaylistsong;
};

const getPlaylistSong = async (playlist, song) => {
	const currentPlaylistSong = await PlaylistSong.findOne({
		where: { PlaylistId: playlist.id, SongId: song.id, active: true },
	});
	if (currentPlaylistSong !== null) {
		return currentPlaylistSong;
	}
	return createPlaylistSong(playlist, song);
};

const updatePlaylistSong = async (
	idplaylist,
	idsong,
	data = {
		add_date: null,
		active: null,
		removed_date: null,
	}
) => {
	const currentPlaylistSong = await PlaylistSong.findOne({
		where: { PlaylistId: idplaylist, SongId: idsong },
	}).catch((err) => {
		console.error(err.message);
		return { error: err.message };
	});
	if (currentPlaylistSong.error) {
		return currentPlaylistSong;
	}
	currentPlaylistSong.set(data);
	const playlistSongSaved = await currentPlaylistSong
		.save()
		.catch((err) => ({ error: err.message }));
	if (playlistSongSaved.error) {
		return playlistSongSaved;
	}
	return currentPlaylistSong;
};

const deletePlaylistSong = async (idplaylist, idsong) => {
	const currentPlaylistSong = await PlaylistSong.findOne({
		where: { PlaylistId: idplaylist, SongId: idsong },
	});
	if (currentPlaylistSong === null) {
		return true;
	}
	const playlistSongDestroyed = await currentPlaylistSong
		.destroy()
		.catch((err) => ({ error: err.message }));

	if (playlistSongDestroyed.error) {
		return playlistSongDestroyed;
	}
	return true;
};

module.exports = { getPlaylistSong, updatePlaylistSong, deletePlaylistSong };
