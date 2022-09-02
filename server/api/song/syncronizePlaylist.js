const { getPlaylistSongsFromAPI,getPlaylistSongs } = require(".");
const {
	getPlaylistSong,
	updatePlaylistSong,
	getSong,
} = require("../../model/");

const syncronizePlaylist = (user, playlist) => {
	const songList = await getPlaylistSongsFromAPI(user, playlist);

	const syncronizeSongs = songList.map((currentSong) => {
		return getSong(user.access_token, currentSong.id, currentSong);
	});

	const removeSongList=await getPlaylistSongs(playlist);
	const removeSongListIds = removeSongList.map((currentSong) => currentSong.id)

	const syncronizeRemoveSongList = removeSongList.map((currentSong) => {
		if(removeSongListIds.includes(currentSong.id)){
			return null
		}
		const deleteData = {
			removed: true,
			removed_date: Date.now(),
		};
		return updatePlaylistSong(playlist, currentSong, deleteData);
	});

	const syncronizeAddSongList = songList.map((currentSong) => {
		return getPlaylistSong(playlist, currentSong);
	});
	return Promise.all(syncronizeSongs)
		.then(
			() => {
				Promise.all(syncronizeRemoveSongList);
			},
			{ error: true, message: "Syncronize Remove songs error" }
		)
		.then(
			() => {
				Promise.all(syncronizeAddSongList);
			},
			{ error: true, message: "Syncronize Add songs error" }
		)
		.finally({
			error: false,
			message: "Syncronize completed",
		});
};

module.exports = { syncronizePlaylist };
