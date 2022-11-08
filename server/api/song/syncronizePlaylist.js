const { getPlaylistSongsFromAPI } = require("./getPlaylistSongsFromAPI");
const {
	getSongFeaturesFromAPI,
} = require("../songfeatures/getSongFeaturesFromAPI");
const { getPlaylistSongs } = require("./getPlaylistSongs");

const {
	getPlaylistSong,
	updatePlaylistSong,
	getSong,
	getSongFeatures,
} = require("../../model/");

const addErrorMessages = (mainResult, result, successMessage) => {
	let isError = false;
	for (const sync of result) {
		if (sync.error) {
			isError = true;
			mainResult.error = true;
			mainResult.message.push(sync.message);
		}
	}
	if (!isError) {
		mainResult.message.push(successMessage);
	}
	return mainResult;
};

const syncronizePlaylist = async (user, playlist) => {
	const currentSongList = await getPlaylistSongs(playlist);
	const songListUpdated = await getPlaylistSongsFromAPI(user, playlist);
	const songFeaturesListUpdated = await getSongFeaturesFromAPI(
		user,
		songListUpdated
	);

	if (songListUpdated.error) {
		songListUpdated.message = [songListUpdated.message];
		return songListUpdated;
	}

	//it's not playlist-song, only "Song" in database
	const syncronizeSongsPromise = songListUpdated.map((currentSong) => {
		return getSong(user.access_token, currentSong.id, currentSong);
	});
	const syncronizeSongsFeaturesPromise = songFeaturesListUpdated.map(
		(feature) => {
			return getSongFeatures(user.access_token, feature.id, feature);
		}
	);

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
			return addErrorMessages(
				{ error: false, message: [] },
				resultSyncronized,
				"Syncronize completed successfully. " + resultSyncronized.length
			);
		})
		.then((result) => {
			return Promise.all(syncronizeSongsFeaturesPromise).then(
				(resultsyncFeatures) => {
					return addErrorMessages(
						result,
						resultsyncFeatures,
						"Syncronize features completed successfully. " +
							resultsyncFeatures.length
					);
				}
			);
		})
		.then((result) => {
			return Promise.all(syncronizeRemoveSongListPromise).then(
				(resultsyncRemove) => {
					return addErrorMessages(
						result,
						resultsyncRemove,
						"Syncronize Remove completed successfully. " +
							resultsyncRemove.length
					);
				}
			);
		})
		.then((result) => {
			return Promise.all(syncronizeAddSongListPromise).then(
				(resultsyncAdd) => {
					return addErrorMessages(
						result,
						resultsyncAdd,
						"Syncronize Add completed successfully. " +
							resultsyncAdd.length
					);
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
