const { getSongs } = require("../../spotifyapi/playlist");
const {
	getSongFeatures: getSongFeaturesAPI,
} = require("../../spotifyapi/song");
const { getPlaylistSongs } = require("./getPlaylistSongs");
const { getSong } = require("../song/getSong");

const {
	createPlaylistSong,
	updatePlaylistSong,
	// createSong,
	getSongFeatures,
} = require("../../model");

const addErrorMessages = (mainResponse, response, successMessage) => {
	let isError = false;
	for (const sync of response) {
		if (sync.error) {
			isError = true;
			mainResponse.error = true;
			mainResponse.message.push(sync.message);
		}
	}
	if (!isError) {
		mainResponse.message.push(successMessage);
	}
	return mainResponse;
};

const syncronizePlaylist = async (user, playlist) => {
	const currentSongList = await getPlaylistSongs(playlist);
	const songListUpdated = await getSongs(user.access_token, playlist);
	const songFeaturesListUpdated = await getSongFeaturesAPI(user, [
		...songListUpdated,
	]);

	if (songListUpdated.error) {
		songListUpdated.message = [songListUpdated.message];
		return songListUpdated;
	}
	if (songFeaturesListUpdated.error) {
		songFeaturesListUpdated.message = [songFeaturesListUpdated.message];
		return songFeaturesListUpdated;
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
					if (newsong.error) {
						return newsong;
					}
					return createPlaylistSong(playlist, newsong);
				}
			);
		});

	return Promise.allSettled(syncronizeSongsPromise)
		.then((responseSyncronized) => {
			return addErrorMessages(
				{ error: false, message: [] },
				responseSyncronized,
				"Syncronize completed successfully. " +
					responseSyncronized.length
			);
		})
		.then((response) => {
			return Promise.allSettled(syncronizeSongsFeaturesPromise).then(
				(responsesyncFeatures) => {
					return addErrorMessages(
						response,
						responsesyncFeatures,
						"Syncronize features completed successfully. " +
							responsesyncFeatures.length
					);
				}
			);
		})
		.then((response) => {
			return Promise.allSettled(syncronizeRemoveSongListPromise).then(
				(responsesyncRemove) => {
					return addErrorMessages(
						response,
						responsesyncRemove,
						"Syncronize Remove completed successfully. " +
							responsesyncRemove.length
					);
				}
			);
		})
		.then((response) => {
			return Promise.allSettled(syncronizeAddSongListPromise).then(
				(responsesyncAdd) => {
					return addErrorMessages(
						response,
						responsesyncAdd,
						"Syncronize Add completed successfully. " +
							responsesyncAdd.length
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
