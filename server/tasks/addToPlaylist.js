const { Op } = require("sequelize");
const { Playlist, Song, User } = require("../database");
const { myRecommendedSongs } = require("../api/song");
const { addSongPlaylist } = require("../api/playlist");

const _MAX_SONGS_PER_PLAYLIST = 200;
const _MIN_SONGS_PER_PLAYLIST = 50;

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
		const playlistSongsList = await getPlaylistSongs(
			fakesession,
			playlist.id
		);
		if (playlistSongsList.error) {
			return playlistSongsList;
		}
		const songlist = await myRecommendedSongs(fakesession, playlist.id);
		if (songlist.error) {
			return songlist;
		}
		response.message.push(`Max songs available: ${songlist.length}`);

		let songsToAdd = 5 + Math.floor(Math.random() * 5);
		if (playlistSongsList.length < _MIN_SONGS_PER_PLAYLIST) {
			songsToAdd++;
		}
		if (playlistSongsList.length > _MX_SONGS_PER_PLAYLIST) {
			songsToAdd--;
		}

		let i = 0;
		for (const songInList of songlist) {
			if (i >= songsToAdd) {
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
