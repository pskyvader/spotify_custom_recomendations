const { PlaylistSong, Playlist, Song } = require("../database");
const createPlaylistSong = async (idplaylist, idsong) => {
	const currentPlaylist = await Playlist.findByPk(idplaylist).catch((err) => {
		console.error(err.message);
		return { error: err.message };
	});
	if (currentPlaylist.error) {
		return currentPlaylist;
	}

	const currentSong = await Song.findByPk(idsong).catch((err) => {
		console.error(err.message);
		return { error: err.message };
	});
	if (currentSong.error) {
		return currentSong;
	}

	const [newplaylistsong] = await PlaylistSong.upsert({
		song_added: Date.now(),
		times_played: 1,
		removed: false,
		PlaylistSong_removed: null,
		playlist: currentPlaylist,
		song: currentSong,
	}).catch((err) => {
		console.error(err.message);
		return { error: err.message };
	});
	return newplaylistsong;
};

const getPlaylistSong = async (idplaylist, idsong) => {
	const currentPlaylistSong = await PlaylistSong.findOne({
		where: { PlaylistId: idplaylist, SongId: idsong },
	});
	if (currentPlaylistSong !== null) {
		return currentPlaylistSong;
	}
	return createPlaylistSong(idplaylist, idsong);
};

const updatePlaylistSong = async (
	idplaylist,
	idsong,
	data = {
		song_added: null,
		times_played: null,
		removed: null,
		PlaylistSong_removed: null,
	}
) => {
	const currentPlaylistSong = await getPlaylistSong(idplaylist, idsong);
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
