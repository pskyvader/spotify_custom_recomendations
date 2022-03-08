const { Op } = require("sequelize");
const { Playlist, Song } = require("../database");
const { myRemoveRecommended } = require("../api/song");
const { removeSongPlaylist } = require("../api/playlist");

const removeFromPlaylist = async (user) => {
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

	const updateResponse = playlists.every(async (playlist) => {
		const songlist = await myRemoveRecommended(fakesession, playlist.id);
		if (songlist.error) {
			return songlist;
		}
		let i = 0;
		songlist.forEach(async (songInList) => {
			if (i > 5) {
				return;
			}
			const currentSong = await Song.findOne({
				where: {
					[Op.and]: [
						{ iduser: iduser },
						{ id: songInList.id },
						{ removed: false },
					],
				},
			});
			if (
				currentSong !== null &&
				currentSong.song_added > Date.now() - 604800000
			) {
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
