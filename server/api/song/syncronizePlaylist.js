const { getPlaylistSongsFromAPI, getPlaylistSongs } = require(".");
const {
	getPlaylistSong,
	updatePlaylistSong,
	getSong,
} = require("../../model/");

const syncronizePlaylist = async (user, playlist) => {
	const currentSongList = await getPlaylistSongs(playlist);
	const songListUpdated = await getPlaylistSongsFromAPI(user, playlist);

	//DB song, not playlist-song
	const syncronizeSongsPromise = songListUpdated.map((currentSong) => {
		return getSong(user.access_token, currentSong.id, currentSong);
	});

	const songListUpdatedIds = songListUpdated.map(
		(currentSong) => currentSong.id
	);

	const syncronizeRemoveSongListPromise = currentSongList.map(
		(currentSong) => {
			if (songListUpdatedIds.includes(currentSong.id)) {
				return null;
			}
			const deleteData = {
				active: false,
				removed_date: Date.now(),
			};
			return updatePlaylistSong(playlist, currentSong, deleteData);
		}
	);

	const syncronizeAddSongListPromise = songListUpdated.map((currentSong) => {
		return getPlaylistSong(playlist, currentSong);
	});
	return Promise.all(syncronizeSongsPromise)
		.then(
			() => {
				Promise.all(syncronizeRemoveSongListPromise);
			},
			{ error: true, message: "Syncronize Remove songs error" }
		)
		.then(
			() => {
				Promise.all(syncronizeAddSongListPromise);
			},
			{ error: true, message: "Syncronize Add songs error" }
		)
		.finally({
			error: false,
			message: "Syncronize completed",
		});
};

module.exports = { syncronizePlaylist };
