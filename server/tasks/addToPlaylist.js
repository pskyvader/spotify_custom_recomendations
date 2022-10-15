const { getRecommendedSongs, getPlaylistSongs } = require("../api/song");
const { addSongToPlaylist } = require("../api/playlist");
const { getSong } = require("../model");

const _MIN_SONGS_PER_PLAYLIST = process.env.MIN_SONGS_PER_PLAYLIST;
const _MAX_SONGS_PER_PLAYLIST = process.env.MAX_SONGS_PER_PLAYLIST;

const addToSinglePlaylist = async (
	user,
	playlist,
	songsToAdd,
	previouslyRemoved,
	average = null
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
		songsToAdd -= 4;
	}

	if (songsToAdd <= 0) {
		responseMessage.push(
			`Too many songs in the playlist, and no song was removed. Current:${playlistSongsList.length}, MAX: ${_MAX_SONGS_PER_PLAYLIST}. Not adding new songs`
		);
		return responseMessage;
	}

	const songlist = await getRecommendedSongs(
		user,
		playlist,
		parseInt(playlistSongsList.length / average || 1)
	);
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

const addToPlaylist = async (
	user,
	songsToAdd,
	removedTotal = {},
	response = { error: false, message: [] }
) => {
	response.message.push("Added :");
	const playlists = await user.getPlaylists({ where: { active: true } });
	const average = response.average || null;
	for (const playlist of playlists) {
		const singleResponse = await addToSinglePlaylist(
			user,
			playlist,
			songsToAdd,
			removedTotal[playlist.id] !== undefined
				? removedTotal[playlist.id]
				: songsToAdd,
			average
		);
		if (singleResponse.error) {
			response.error = true;
			response.message.push(singleResponse.message);
			return response;
		}
		response.message.push(...singleResponse);
	}
	return response;
};

module.exports = { addToPlaylist };
