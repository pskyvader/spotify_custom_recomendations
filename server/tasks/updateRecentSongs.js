const { getRecentlyPlayedSongsFromAPI } = require("../api/song/");
const { Song } = require("../database");

const { createUserSong, getSong } = require("../model");

const updateRecentSongs = async (user) => {
	const recentSongsAPI = await getRecentlyPlayedSongsFromAPI(user);
	const userSongHistory = await user.getUserSongHistories();
	const songsToAdd = recentSongsAPI.filter((song) => {
		song.played_date = new Date(song.played_date).getTime();
		console.log(song.name, song.played_date);
		const found = userSongHistory.find((history) => {
			if (
				history.SongId === song.id &&
				history.played_date.getTime() === song.played_date
			) {
				console.log(history.played_date.getTime());
			}

			return (
				history.SongId === song.id &&
				history.played_date.getTime() === song.played_date
			);
		});
		return found === undefined;
	});

	const addTasks = songsToAdd.map((songtoadd) => {
		return getSong(user.access_token, songtoadd.id).then((song) => {
			if (song.error) {
				console.error("ADDING TO HISTORY ERROR");
				console.error("ADDING TO HISTORY ERROR");
				console.error("ADDING TO HISTORY ERROR");
				console.error("ADDING TO HISTORY ERROR");
				console.error("ADDING TO HISTORY ERROR");
				console.error("ADDING TO HISTORY ERROR");
				console.error("ADDING TO HISTORY ERROR");
				console.error("ADDING TO HISTORY ERROR");
				console.error("ADDING TO HISTORY ERROR");
				console.error(song);
				return song;
			}
			return createUserSong(user, song, songtoadd.played_date);
		});
	});
	return Promise.all(addTasks)
		.then((results) => {
			console.log("UPDATED SONGS", results);
			return { error: false, message: `${results.length} Songs updated` };
		})
		.catch((err) => {
			return { error: true, message: err.message };
		});
};

module.exports = { updateRecentSongs };
