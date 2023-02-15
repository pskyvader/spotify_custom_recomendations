const { getSong: getSongDB, createSong } = require("../../model");
const { getSong: getSongAPI } = require("../../spotifyapi/song");

const getSong = (songId, songData = null) => {
	return getSongDB(songId).then((currentSong) => {
		if (currentSong === null) {
			if (songData !== null) {
				return createSong(songData);
			}
			return getSongAPI(songId).then((songFromAPI) => {
				if (songFromAPI.error) {
					return songFromAPI;
				}
				return createSong(songFromAPI);
			});
		}
		if (currentSong.error) {
			return currentSong;
		}
		return currentSong.update(song);
	});
};

module.exports = { getSong };
