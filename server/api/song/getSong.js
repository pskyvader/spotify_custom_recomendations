const { getSong: getSongDB, createSong } = require("../../model");
const { getSong: getSongAPI } = require("../../spotifyapi/song");
const {log}=require("../../utils/logger");


const getSong = (access_token, songId, songData = null) => {
	//log("api/song/get song");
	return getSongDB(songId)
		.then((currentSong) => {
			//log(`current song: ${currentSong}`);
			if (currentSong === null) {
				//log("current song null");
				if (songData !== null) {
					//log("song data not null, creating song in db");
					return createSong(songData);
				}
				//log("get song from api");
				return getSongAPI(access_token, songId).then((songFromAPI) => {
					//log(`song from api: ${songFromAPI}`);
					if (songFromAPI.error) {
						return songFromAPI;
					}
					return createSong(songFromAPI);
				});
			}
			if (currentSong.error) {
				//log ("current song error");
				return currentSong;
			}
			//log("update song data");
			return currentSong.update(songData);
		})
		.catch((err) => {
			return { error: true, message: err.message };
		});
};

module.exports = { getSong };
