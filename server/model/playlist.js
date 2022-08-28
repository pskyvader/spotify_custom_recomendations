const { Playlist, PlaylistSong } = require("../database");
const { request } = require("../utils");

const createPlaylist = async (user, { idplaylist, name, active }) => {
	const [newplaylist] = await Playlist.upsert({
		id: idplaylist,
		name: name,
		active: active,
		user: user,
	}).catch((err) => {
		console.error(err);
		return { error: err.message };
	});
	return newplaylist;
};
const getPlaylist = async (user, idplaylist) => {
	const currentPlaylist = await Playlist.findByPk(idplaylist, {
		where: { UserId: user.id },
	}); //, { raw: true, }
	if (currentPlaylist !== null) {
		return currentPlaylist;
	}

	let url = `https://api.spotify.com/v1/playlists/${idplaylist}`;
	const response = await request(user.access_token, url);
	if (response.error) {
		return response;
	}
	const data = {
		id: idplaylist,
		name: response.name,
		active: false,
	};
	return createPlaylist(user, data);
};

const updatePlaylist = async (user, idplaylist, { active, name }) => {
	const currentPlaylist = await getPlaylist(idplaylist, user);
	if (currentPlaylist.error) {
		return currentPlaylist;
	}
	currentPlaylist.active = active;
	currentPlaylist.name = name;
	await currentPlaylist.save();
	return currentPlaylist;
};

const deletePlaylist = async (user, idplaylist) => {
	const currentPlaylist = await Playlist.findByPk(idplaylist, {
		where: { UserId: user.id },
	});
	if (currentPlaylist === null) {
		return true;
	}
	PlaylistSong.destroy({
		where: { PlaylistId: idplaylist },
	});

	return currentPlaylist.destroy();
};

module.exports = { getPlaylist, updatePlaylist, deletePlaylist };
