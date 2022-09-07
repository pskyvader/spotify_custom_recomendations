const {
	getRecommendedSongsToRemove,
	getPlaylistSongs,
} = require("../api/song");
const { removeSongPlaylist } = require("../api/playlist");

const _MAX_SONGS_PER_PLAYLIST = 200;
const _MIN_SONGS_PER_PLAYLIST = 50;

const removefromSinglePlaylist = async (user, playlist, songsToRemove) => {
	const responseMessage = [];
	const playlistSongsList = await getPlaylistSongs(playlist);
	if (playlistSongsList.error) {
		return playlistSongsList;
	}
	const songlist = await getRecommendedSongsToRemove(user, playlist);
	if (songlist.error) {
		return songlist;
	}

	if (playlistSongsList.length < _MIN_SONGS_PER_PLAYLIST) {
		songsToRemove -= 2;
	}
	if (playlistSongsList.length > _MAX_SONGS_PER_PLAYLIST) {
		songsToRemove += 2;
	}

	responseMessage.push(
		`Max songs available for deletion: ${songlist.length} of ${playlistSongsList.length}, will attempt to remove a max of ${songsToRemove}`
	);

	let i = 0;
	for (const songInList of songlist) {
		if (i >= songsToRemove) {
			break;
		}
		const removeResponse = await removeSongPlaylist(
			fakesession,
			songInList.uniqueid,
			playlist.id
		);
		if (removeResponse.error) {
			response.error = true;
			responseMessage.push(
				`Error removing song ${songInList.name} from playlist ${playlist.name}`
			);
			responseMessage.push(JSON.stringify(removeResponse));
			continue;
		}

		responseMessage.push(`Removed song: ${songInList.name}`);
		i++;
	}
	return responseMessage;
};

const removeFromPlaylist = async (user, songsToRemove) => {
	const response = { error: false, message: [] };
	const fakesession = {
		hash: user.hash,
		access_token: user.access_token,
		refresh_token: user.refresh_token,
	};
	const playlists = await user.getPlaylists({ where: { active: true } });
	for (const playlist of playlists) {
		response.message.push(
			await removefromSinglePlaylist(user, playlist, songsToRemove)
		);
	}

	return response;
};

module.exports = { removeFromPlaylist };
