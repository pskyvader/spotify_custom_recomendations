const { Op } = require("sequelize");
const { Playlist, Song, User } = require("../database");
const { myRecommendedSongs, getPlaylistSongs } = require("../api/song");
const { addSongPlaylist } = require("../api/playlist");

const _MAX_SONGS_PER_PLAYLIST = 200;
const _MIN_SONGS_PER_PLAYLIST = 50;

const addtoSinglePlaylist = async (
	playlist,
	fakesession,
	songsToAdd,
	userId
) => {
	const responseMessage = [];
	const playlistSongsList = await getPlaylistSongs(fakesession, playlist.id);
	if (playlistSongsList.error) {
		return playlistSongsList;
	}
	const songlist = await myRecommendedSongs(fakesession, playlist.id);
	if (songlist.error) {
		return songlist;
	}

	if (playlistSongsList.length < _MIN_SONGS_PER_PLAYLIST) {
		songsToAdd += 2;
	}
	if (playlistSongsList.length > _MAX_SONGS_PER_PLAYLIST) {
		songsToAdd -= 2;
	}
	responseMessage.push(
		`Max songs available to add: ${songlist.length} to the ${playlistSongsList.length} already in playlist, will attempt to add ${songsToAdd}`
	);

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

		const addSongResult = await addSongPlaylist(
			fakesession,
			songInList.action,
			playlist.id
		);
		if (addSongResult.error) {
			response.error = true;
			responseMessage.push(
				`Error adding song ${songInList.name} to playlist ${playlist.name}`
			);
			responseMessage.push(JSON.stringify(addSongResult));
			continue;
		}
		i++;
		responseMessage.push(`Added song: ${songInList.name}`);
	}
	return responseMessage;
};

const addToPlaylist = async (user, songsToAdd) => {
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
		response.message.push(
			await addtoSinglePlaylist(playlist, fakesession, songsToAdd, userId)
		);
	}

	return response;
};

module.exports = { addToPlaylist };
