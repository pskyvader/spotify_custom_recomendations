const { getSong: getSongDB, createSong } = require("../../model");
const { getSong: getSongAPI } = require("../../spotifyapi/song");

const getSong = (access_token, songId, songData = null) => {
	return getSongDB(songId)
		.then((currentSong) => {
			if (currentSong === null) {
				if (songData !== null) {
					return createSong(songData);
				}
				return getSongAPI(access_token, songId).then((songFromAPI) => {
					if (songFromAPI.error) {
						return songFromAPI;
					}
					return createSong(songFromAPI);
				});
			}
			if (currentSong.error) {
				return currentSong;
			}
			return currentSong.update(songData);
		})
		.catch((err) => {
			return { error: true, message: err.message };
		});
};

module.exports = { getSong };
