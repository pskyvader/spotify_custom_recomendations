const { Playlist, PlaylistSong } = require("../database");

const createPlaylist = (playlistData) => {
	return Playlist.create(playlistData).catch((err) => {
		console.error("create user song error ", err);
		return { error: true, message: err.message };
	});
};

const getPlaylist = (UserId, id) => {
	return Playlist.findOne({
		where: { id: id, UserId: UserId },
	}).then((currentPlaylist) => {
		if (currentPlaylist === null) {
			return { error: true, message: "Playlist not found" };
		}
		return currentPlaylist;
	});
};

const updatePlaylist = async (
	idplaylist,
	data = { name: null, active: null }
) => {
	const currentPlaylist = await Playlist.findByPk(idplaylist); //, { raw: true, }
	if (currentPlaylist.error) {
		return currentPlaylist;
	}
	currentPlaylist.set(data);
	const playlistSaved = await currentPlaylist
		.save()
		.catch((err) => ({ error: err.message }));
	if (playlistSaved.error) {
		return playlistSaved;
	}
	return currentPlaylist;
};

const deletePlaylist = async (user, idplaylist) => {
	const currentPlaylist = await Playlist.findByPk(idplaylist, {
		where: { UserId: user.id },
	});
	if (currentPlaylist === null) {
		return true;
	}
	const songsDestroyed = await PlaylistSong.destroy({
		where: { PlaylistId: idplaylist },
	}).catch((err) => ({
		error: err.message,
	}));
	if (songsDestroyed.error) {
		return songsDestroyed;
	}

	const playlistDestroyed = await currentPlaylist
		.destroy()
		.catch((err) => ({ error: err.message }));

	if (playlistDestroyed.error) {
		return playlistDestroyed;
	}
	return true;
};

module.exports = {
	createPlaylist,
	getPlaylist,
	updatePlaylist,
	deletePlaylist,
};
