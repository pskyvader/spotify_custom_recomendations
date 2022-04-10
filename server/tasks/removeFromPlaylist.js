const { Op } = require("sequelize");
const { Playlist, Song } = require("../database");
const { myRemoveRecommended, getPlaylistSongs } = require("../api/song");
const { removeSongPlaylist } = require("../api/playlist");

const removeFromPlaylist = async (user) => {
	const response = { error: false, message: [] };
	const fakesession = {
		hash: user.hash,
		access_token: user.access_token,
		refresh_token: user.refresh_token,
	};
	const iduser = user.id;

	const playlists = await Playlist.findAll({
		where: {
			[Op.and]: [{ iduser: iduser }, { active: true }],
		},
	});

	for (const playlist of playlists) {
		await getPlaylistSongs(fakesession, playlist.id, true);
		const songlist = await myRemoveRecommended(fakesession, playlist.id);
		if (songlist.error) {
			return songlist;
		}
		response.message.push(
			`Max songs available for deletion: ${songlist.length}`
		);
		let i = 0;
		for (const songInList of songlist) {
			if (i >= 5) {
				break;
			}
			await removeSongPlaylist(
				fakesession,
				songInList.action,
				playlist.id
			);
			i++;
			response.message.push(`Removed song: ${songInList.name}`);
		}
	}

	return response;
};

module.exports = { removeFromPlaylist };
