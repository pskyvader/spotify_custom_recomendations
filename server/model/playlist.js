const { Playlist, PlaylistSong } = require("../database");
const { request } = require("../utils");

const createPlaylist = async (user, idplaylist, active = false) => {
	let url = `https://api.spotify.com/v1/playlists/${idplaylist}`;
	const response = await request(user.access_token, url);
	if (response.error) {
		return response;
	}
	const [newplaylist] = await Playlist.upsert({
		id: idplaylist,
		name: response.name,
		active: active,
		image: response.images ? response.images[0].url : null,
		UserId: user.id,
	}).catch((err) => ({
		error: err.message,
	}));
	return newplaylist;
};
const getPlaylist = async (user, idplaylist) => {
	const currentPlaylist = await Playlist.findByPk(idplaylist, {
		where: { UserId: user.id },
	}); //, { raw: true, }
	if (currentPlaylist !== null) {
		return currentPlaylist;
	}

	return createPlaylist(user, idplaylist, false);
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

module.exports = { getPlaylist, updatePlaylist, deletePlaylist };
