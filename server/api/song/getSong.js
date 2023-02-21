const { getSong: getSongDB, createSong } = require("../../model");
const { getSong: getSongAPI } = require("../../spotifyapi/song");

const getSong = (access_token, songId, songData = null) => {
	return getSongDB(access_token, songId)
		.then((currentSong) => {
			console.log("Current song: ", currentSong, songId);
			if (currentSong === null) {
				if (songData !== null) {
					console.log("createSong ", songData);
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
		})
		.catch((err) => {
			return { error: true, message: err.message };
		});
};

module.exports = { getSong };
