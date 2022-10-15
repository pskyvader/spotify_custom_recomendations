const {
	getRecommendedSongsToRemove,
	getPlaylistSongs,
} = require("../api/song");
const { removeSongFromPlaylistFromAPI } = require("../api/playlist");

const _MIN_SONGS_PER_PLAYLIST = process.env.MIN_SONGS_PER_PLAYLIST;
const _MAX_SONGS_PER_PLAYLIST = process.env.MAX_SONGS_PER_PLAYLIST;

const removeFromSinglePlaylist = async (user, playlist, songsToRemove) => {
	const response = { error: false, message: [], removedTotal: 0 };
	const playlistSongsList = await getPlaylistSongs(playlist);
	if (playlistSongsList.error) {
		return playlistSongsList;
	}
	const songlist = await getRecommendedSongsToRemove(playlist);
	if (songlist.error) {
		return songlist;
	}

	if (playlistSongsList.length < _MIN_SONGS_PER_PLAYLIST) {
		songsToRemove -= 2;
	}
	if (playlistSongsList.length > _MAX_SONGS_PER_PLAYLIST) {
		songsToRemove += 2;
	}

	response.message.push(
		`Max songs available for deletion: ${songlist.length} of ${playlistSongsList.length}, will attempt to remove a max of ${songsToRemove}`
	);

	let i = 0;
	for (const songInList of songlist) {
		if (i >= songsToRemove) {
			break;
		}
		const removeResponse = await removeSongFromPlaylistFromAPI(
			user,
			songInList,
			playlist
		);
		if (removeResponse.error) {
			response.message.push(
				`Error removing song ${songInList.name} from playlist ${playlist.name}`
			);
			response.message.push(JSON.stringify(removeResponse));
			continue;
		}
		response.message.push(`Removed song: ${songInList.name}`);
		response.removedTotal += 1;
		i++;
	}
	return response;
};

const removeFromPlaylist = async (
	user,
	songsToRemove,
	response = { error: false, message: [] }
) => {
	response.removedTotal = {};
	response.message.push("Removed :");
	const playlists = await user.getPlaylists({ where: { active: true } });
	for (const playlist of playlists) {
		const singleResponse = await removeFromSinglePlaylist(
			user,
			playlist,
			songsToRemove
		);
		response.message.push(...singleResponse.message);
		response.removedTotal[playlist.id] = singleResponse.removedTotal;
	}
	return response;
};

module.exports = { removeFromPlaylist };
