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
	const response = { error: false, message: [], addedTotal: 0 };
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
		response.message.push(
			`Too many songs in the playlist, and no song was removed. Current:${playlistSongsList.length}, MAX: ${_MAX_SONGS_PER_PLAYLIST}. Not adding new songs`
		);
		return response;
	}

	const songlist = await getRecommendedSongs(
		user,
		playlist,
		parseInt(playlistSongsList.length / average || 1)
	);
	if (songlist.error) {
		return songlist;
	}

	response.message.push(
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
			response.error = true;
			response.message.push(
				`Error adding song ${currentSong.name} to playlist ${playlist.name}`
			);
			response.message.push(JSON.stringify(addSongResult));
			continue;
		}
		i++;
		response.message.push(`Added song: ${currentSong.name}`);
	}
	response.addedTotal = i;
	return response;
};

const addToPlaylist = async (
	user,
	songsToAdd,
	removedTotal = {},
	response = { error: false, message: [] }
) => {
	response.addedTotal = {};
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
		response.error = response.error || singleResponse.error;
		response.message.push(...singleResponse.message);
		response.addedTotal[playlist.id] = singleResponse.addedTotal;
	}
	return response;
};

module.exports = { addToPlaylist };
