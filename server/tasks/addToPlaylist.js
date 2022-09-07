const { getRecommendedSongs, getPlaylistSongs } = require("../api/song");
const { addSongToPlaylist } = require("../api/playlist");

const _MAX_SONGS_PER_PLAYLIST = 200;
const _MIN_SONGS_PER_PLAYLIST = 50;

const addToSinglePlaylist = async (user, playlist, songsToAdd) => {
	const responseMessage = [];
	const playlistSongsList = await getPlaylistSongs(playlist);
	if (playlistSongsList.error) {
		return playlistSongsList;
	}
	const songlist = await getRecommendedSongs(user, playlist);
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
		`Max songs available to add: ${songlist.length} to the ${playlistSongsList.length} already in playlist, will attempt to add a max of ${songsToAdd}`
	);

	let i = 0;
	for (const songInList of songlist) {
		if (i >= songsToAdd) {
			break;
		}
		const addSongResult = await addSongToPlaylist(
			user,
			songInList,
			playlist
		);
		if (addSongResult.error) {
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
	const playlists = await user.getPlaylists({ where: { active: true } });
	for (const playlist of playlists) {
		response.message.push(
			await addToSinglePlaylist(user, playlist, songsToAdd)
		);
	}
	return response;
};

module.exports = { addToPlaylist };
