const { getRecommendedSongs, getPlaylistSongs } = require("../api/song");
const { addSongToPlaylist } = require("../api/playlist");
const { getSong } = require("../model");

const _MAX_SONGS_PER_PLAYLIST = 200;
const _MIN_SONGS_PER_PLAYLIST = 50;

const addToSinglePlaylist = async (
	user,
	playlist,
	songsToAdd,
	previouslyRemoved
) => {
	const responseMessage = [];
	const playlistSongsList = await getPlaylistSongs(playlist);
	if (playlistSongsList.error) {
		return playlistSongsList;
	}

	if (playlistSongsList.length < _MIN_SONGS_PER_PLAYLIST) {
		songsToAdd += 2;
	}
	if (playlistSongsList.length > _MAX_SONGS_PER_PLAYLIST) {
		songsToAdd = Math.min(songsToAdd, previouslyRemoved);
		songsToAdd -= 2;
	}

	if (songsToAdd <= 0) {
		responseMessage.push(
			`Too many songs in the playlist, and no song was removed. Current:${playlistSongsList.length}, MAX: ${_MAX_SONGS_PER_PLAYLIST}. Not adding new songs`
		);
		return responseMessage;
	}

	const songlist = await getRecommendedSongs(user, playlist);
	if (songlist.error) {
		return songlist;
	}

	responseMessage.push(
		`Max songs available to add: ${songlist.length} to the ${playlistSongsList.length} already in playlist, will attempt to add a max of ${songsToAdd}. Previously removed: ${previouslyRemoved}`
	);

	let i = 0;
	for (const songInList of songlist) {
		if (i >= songsToAdd) {
			break;
		}
		const currentSong = await getSong(
			user.access_token,
			songInList.id,
			songInList
		);

		const addSongResult = await addSongToPlaylist(
			user,
			currentSong,
			playlist
		);
		if (addSongResult.error) {
			responseMessage.push(
				`Error adding song ${currentSong.name} to playlist ${playlist.name}`
			);
			responseMessage.push(JSON.stringify(addSongResult));
			continue;
		}
		i++;
		responseMessage.push(`Added song: ${currentSong.name}`);
	}
	return responseMessage;
};

const addToPlaylist = async (user, songsToAdd, removedTotal = {}) => {
	const response = { error: false, message: [] };
	const playlists = await user.getPlaylists({ where: { active: true } });
	for (const playlist of playlists) {
		const singleResponse = await addToSinglePlaylist(
			user,
			playlist,
			songsToAdd,
			removedTotal[playlist.id] !== undefined
				? removedTotal[playlist.id]
				: songsToAdd
		);
		response.message.push(...singleResponse);
	}
	return response;
};

module.exports = { addToPlaylist };
