const { getPlaylistSongsFromAPI } = require(".");
const { getPlaylistSong, getSong } = require("../../model/");

const syncronizePlaylist = (user, playlist) => {
	const songList = getPlaylistSongsFromAPI(user, playlist);

	const syncronizeSongs = songList.map((currentSong) => {
		return getSong(user.access_token, currentSong.id, currentSong);
	});

	const syncronizeSongList = songList.map((currentSong) => {
		return getPlaylistSong(playlist.id, currentSong.id);
	});
	return Promise.all(syncronizeSongs)
		.then(
			() => {
				Promise.all(syncronizeSongList);
			},
			{ error: true, message: "Syncronize songs error" }
		)
		.finally({
			error: false,
			message: "Syncronize completed",
		});
};

module.exports = { syncronizePlaylist };
