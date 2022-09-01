const { getPlaylistSongsFromAPI } = require(".");
const { getSong } = require("../../model/");

const syncronizePlaylist = (user, playlist) => {
	const songList = getPlaylistSongsFromAPI(user, playlist);
	const syncronizeSongList = songList.map((currentSong) => {
		return getSong(user.access_token, currentSong.id);
	});
	return Promise.all(syncronizeSongList);
};

module.exports = { syncronizePlaylist };
