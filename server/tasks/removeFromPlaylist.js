const { Op } = require("sequelize");
const { Playlist } = require("../database");
const { myRemoveRecommended } = require("../api/song");
const { removeSongPlaylist } = require("../api/playlist");

const removeFromPlaylist = async (access_token, iduser) => {
	const fakesession = { access_token: access_token };
	const playlists = await Playlist.getall({
		where: {
			[Op.and]: [{ iduser: iduser }, { active: true }],
		},
	});

	const updateResponse = playlists.every(async (playlist) => {
		const songlist = await myRemoveRecommended(fakesession, playlist.id);
		if (songlist.error) {
			return songlist;
		}
		let i = 0;
		songlist.forEach((songInList) => {
			if (i > 5) {
				return;
			}
			//await ?
			removeSongPlaylist(fakesession, songInList.action, playlist.id);
			i++;
		});
	});

	if (updateResponse.error) {
		return updateResponse;
	}
};

module.exports = { removeFromPlaylist };
