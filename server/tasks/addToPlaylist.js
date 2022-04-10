const { Op } = require("sequelize");
const { Playlist, Song, User } = require("../database");
const { myRecommendedSongs } = require("../api/song");
const { addSongPlaylist } = require("../api/playlist");

const addToPlaylist = async (user) => {
	const response = { error: false, message: [] };
	const fakesession = {
		hash: user.hash,
		access_token: user.access_token,
		refresh_token: user.refresh_token,
	};
	const userId = user.id;

	const playlists = await Playlist.findAll({
		where: {
			[Op.and]: [{ iduser: userId }, { active: true }],
		},
	});

	for (const playlist of playlists) {
		const songlist = await myRecommendedSongs(fakesession, playlist.id);
		if (songlist.error) {
			return songlist;
		}
		response.message.push(`Max songs available: ${songlist.length}`);
		let i = 0;
		for (const songInList of songlist) {
			if (i >= 5) {
				break;
			}
			const currentSong = await Song.findOne({
				where: { id: songInList.id },
				include: {
					model: User,
					where: {
						id: userId,
					},
				},
				through: {
					where: {
						removed: true,
					},
				},
			});

			if (currentSong !== null) {
				continue;
			}

			//await ?
			const addSongResult = await addSongPlaylist(
				fakesession,
				songInList.action,
				playlist.id
			);
			if (addSongResult.error) {
				return addSongResult;
			}
			i++;
			response.message.push(`Added song: ${songInList.name}`);
		}
	}

	return response;
};

module.exports = { addToPlaylist };
