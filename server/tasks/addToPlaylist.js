const { Op } = require("sequelize");
const { Playlist, Song } = require("../database");
const { myRecommendedSongs } = require("../api/song");
const { addSongPlaylist } = require("../api/playlist");

const addToPlaylist = async (access_token, iduser) => {
	const fakesession = { access_token: access_token };
	const playlists = await Playlist.getall({
		where: {
			[Op.and]: [{ iduser: iduser }, { active: true }],
		},
	});

	const updateResponse = playlists.every(async (playlist) => {
		const songlist = await myRecommendedSongs(access_token, playlist.id);
		if (songlist.error) {
			return songlist;
		}
		let i = 0;
		songlist.forEach((songInList) => {
			if (i > 5) {
				return;
			}
			const currentSong = await Song.findOne({
				where: {
					[Op.and]: [
						{ iduser: iduser },
						{ id: songInList.id },
						{ removed: true },
					],
				},
			});
			if (currentSong !== null) {
				return;
			}

			//await ?
			addSongPlaylist(fakesession, songInList.action, playlist.id);
			i++;
		});
	});

	if (updateResponse.error) {
		return updateResponse;
	}
};

module.exports = { addToPlaylist };
