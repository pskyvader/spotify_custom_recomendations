const { Op } = require("sequelize");

const { Playlist } = require("../database");
const { request } = require("../utils");
const { getUser } = require("./user");

const togglePlaylist = async (session, idplaylist, active = false) => {
	const access_token = session.access_token;
	const currentUser = await getUser(session);
	if (currentUser.error) {
		return currentUser;
	}
	const iduser = currentUser.id;

	const currentPlaylist = await getPlaylist(access_token, idplaylist, iduser);
	if (currentPlaylist.error) {
		return currentPlaylist;
	}
	currentPlaylist.active = active;
	await Playlist.update(currentPlaylist, {
		where: { [Op.and]: [{ iduser: iduser }, { id: idplaylist }] },
	}).catch((err) => {
		console.error(err);
		return { error: err.message };
	});
	return currentPlaylist;
};

const playlistStatus = async (session, idplaylist) => {
	const currentUser = await getUser(session);
	const access_token = session.access_token;
	if (currentUser.error) {
		return currentUser;
	}
	const iduser = currentUser.id;
	const currentPlaylist = await getPlaylist(access_token, idplaylist, iduser);
	if (currentPlaylist.error) {
		return currentPlaylist;
	}
	return { active: currentPlaylist.active };
};

const getPlaylist = async (access_token, idplaylist, iduser) => {
	const currentPlaylist = await Playlist.findOne({
		where: { [Op.and]: [{ iduser: iduser }, { id: idplaylist }] },
		raw: true,
	});
	if (currentPlaylist !== null) {
		return currentPlaylist;
	}

	let url = `https://api.spotify.com/v1/playlists/${idplaylist}`;
	const response = await request(access_token, url);
	if (response.error) {
		return response;
	}
	const data = {
		id: idplaylist,
		iduser: iduser,
		name: response.name,
		active: false,
	};

	await Playlist.upsert(data).catch((err) => {
		console.error(err);
		return { error: err.message };
	});
	return data;
};

module.exports = { getPlaylist, togglePlaylist, playlistStatus };
