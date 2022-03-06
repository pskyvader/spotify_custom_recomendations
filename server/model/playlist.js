const { Op } = require("sequelize");

const { Playlist } = require("../database");
const { request } = require("../utils");

const getPlaylist = (access_token, idplaylist, iduser) => {
	const currentPlaylist = await Playlist.findOne({
		where: { [Op.and]: [{ iduser: iduser }, { id: idplaylist }] },
	});
	if (currentPlaylist !== null) {
		return currentPlaylist;
	}

	let url = `https://api.spotify.com/v1/playlists/${idplaylist}`;
	const response = await request(access_token, url);
	if (response.error) {
		return response;
	}
	const data = { iduser: iduser, name: response.name, active: false };

	await Song.upsert(data).catch((err) => {
		console.error(err);
		return { error: err.message };
	});
	return data;
};

module.exports = { getPlaylist };
