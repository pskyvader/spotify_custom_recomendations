const { getPlaylistSongsFromAPI } = require("./getPlaylistSongsFromAPI");
const { getPlaylistSongs } = require("./getPlaylistSongs");

const {
	getPlaylistSong,
	updatePlaylistSong,
	getSong,
} = require("../../model/");

const syncronizePlaylist = async (user, playlist) => {
	const currentSongList = await getPlaylistSongs(playlist);
	const songListUpdated = await getPlaylistSongsFromAPI(user, playlist);
	if (songListUpdated.error) {
		songListUpdated.message = [songListUpdated.message];
		return songListUpdated;
	}

	//it's not playlist-song, only "Song" in database
	const syncronizeSongsPromise = songListUpdated.map((currentSong) => {
		return getSong(user.access_token, currentSong.id, currentSong);
	});

	const currentSongListIds = currentSongList.map(
		(currentSong) => currentSong.id
	);

	const songListUpdatedIds = songListUpdated.map(
		(currentSong) => currentSong.id
	);

	const syncronizeRemoveSongListPromise = currentSongList
		.filter((currentSong) => {
			return !songListUpdatedIds.includes(currentSong.id);
		})
		.map((currentSong) => {
			const deleteData = {
				active: false,
				removed_date: Date.now(),
			};
			return updatePlaylistSong(playlist.id, currentSong.id, deleteData);
		});

	const syncronizeAddSongListPromise = songListUpdated
		.filter((currentSong) => {
			return !currentSongListIds.includes(currentSong.id);
		})
		.map((currentSong) => {
			return getSong(user.access_token, currentSong.id, currentSong).then(
				(newsong) => {
					return getPlaylistSong(playlist, newsong);
				}
			);
		});
	return Promise.all(syncronizeSongsPromise)
		.then((resultSyncronized) => {
			const result = { error: false, message: [] };
			for (const sync of resultSyncronized) {
				if (sync.error) {
					result.error = true;
					result.message.push(sync.message);
				}
			}
			if (result.message.length === 0) {
				result.message.push("Syncronize completed successfully. ");
			}
			return result;
		})
		.then((result) => {
			return Promise.all(syncronizeRemoveSongListPromise).then(
				(resultsyncRemove) => {
					let isError = false;
					for (const sync of resultsyncRemove) {
						if (sync.error) {
							isError = true;
							result.error = true;
							result.message.push(sync.message);
						}
					}
					if (isError) {
						result.message.push(
							"Syncronize Remove completed successfully. "
						);
					}
					return result;
				}
			);
		})
		.then((result) => {
			return Promise.all(syncronizeAddSongListPromise).then(
				(resultsyncAdd) => {
					for (const sync of resultsyncAdd) {
						if (sync.error) {
							result.error = true;
							result.message.push(sync.message);
						}
					}
					if (result.message.length === 0) {
						result.message.push(
							"Syncronize Add completed successfully. "
						);
					}
					return result;
				}
			);
		});
};

const syncronizeMultiplePlaylists = async (user) => {
	const response = { error: false, message: [] };
	const playlists = await user.getPlaylists({ where: { active: true } });
	for (const playlist of playlists) {
		response.message.push(`Playlist ${playlist.name}`);
		const playlistResponse = await syncronizePlaylist(user, playlist);
		response.error = response.error || playlistResponse.error;
		response.message.push(...playlistResponse.message);
	}
	return response;
};

module.exports = { syncronizePlaylist, syncronizeMultiplePlaylists };
