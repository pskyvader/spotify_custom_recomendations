const { deprecate } = require("util");
const { PlaylistSong, Song } = require("../database");
const createPlaylistSong = async (playlist, song) => {
	const upsertData = {
		add_date: Date.now(),
		removed_date: null,
		active: true,
		PlaylistId: playlist.id,
		SongId: song.id,
	};
	const newplaylistsong = await PlaylistSong.findOne({
		where: { PlaylistId: playlist.id, SongId: song.id },
	})
		.then((song) => {
			if (song === null) {
				return PlaylistSong.create(upsertData);
			}
			return PlaylistSong.update(upsertData, { where: { id: song.id } });
		})
		.catch((err) => {
			console.error("create playlist song error", err);
			return { error: true, message: err.message };
		});

	song.set({ last_time_used: Date.now() });
	song.save();
	return newplaylistsong;
};

const _getPlaylistSong = async (playlist, song) => {
	const currentPlaylistSong = await PlaylistSong.findOne({
		where: { PlaylistId: playlist.id, SongId: song.id, active: true },
	});
	if (currentPlaylistSong !== null) {
		return currentPlaylistSong;
	}
	return createPlaylistSong(playlist, song);
};

const getPlaylistSong = deprecate(
	_getPlaylistSong,
	"Deprecated Function, use createPlaylistSong instead",
	"Deprecation API"
);

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
		include: [Song],
	}).catch((err) => {
		console.error("find playlist song error ", err);
		return { error: true, message: err.message };
	});

	if (currentPlaylistSong === null) {
		return { error: true, message: "Song in playlists not found" };
	}
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

	currentPlaylistSong.Song.set({ last_time_used: Date.now() });
	currentPlaylistSong.Song.save();

	return currentPlaylistSong;
};

const deletePlaylistSong = async (idplaylist, idsong) => {
	const playlistSongDestroyed = await PlaylistSong.destroy({
		where: { PlaylistId: idplaylist, SongId: idsong },
	}).catch((err) => ({ error: err.message }));

	if (playlistSongDestroyed.error) {
		return playlistSongDestroyed;
	}
	return true;
};

module.exports = {
	createPlaylistSong,
	getPlaylistSong,
	updatePlaylistSong,
	deletePlaylistSong,
};
