const { getSongs } = require("../../spotifyapi/playlist");
const {
	getSongFeaturesFromAPI,
} = require("../songfeatures/getSongFeaturesFromAPI");
const { getPlaylistSongs } = require("./getPlaylistSongs");

const {
	createPlaylistSong,
	updatePlaylistSong,
	createSong,
	// getSong,
	getSongFeatures,
} = require("../../model/");

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
	const songFeaturesListUpdated = await getSongFeaturesFromAPI(user, [
		...songListUpdated,
	]);

	if (songListUpdated.error) {
		songListUpdated.message = [songListUpdated.message];
		return songListUpdated;
	}

	//it's not playlist-song, only "Song" in database
	const syncronizeSongsPromise = songListUpdated.map((currentSong) => {
		return createSong(user.access_token, currentSong.id, currentSong);
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
			return createSong(
				user.access_token,
				currentSong.id,
				currentSong
			).then((newsong) => {
				return createPlaylistSong(playlist, newsong);
			});
		});
	return Promise.all(syncronizeSongsPromise)
		.then((responseSyncronized) => {
			return addErrorMessages(
				{ error: false, message: [] },
				responseSyncronized,
				"Syncronize completed successfully. " + responseSyncronized.length
			);
		})
		.then((response) => {
			return Promise.all(syncronizeSongsFeaturesPromise).then(
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
			return Promise.all(syncronizeRemoveSongListPromise).then(
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
			return Promise.all(syncronizeAddSongListPromise).then(
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
