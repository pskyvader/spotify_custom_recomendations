const {
	getRecentlyPlayedSongsFromAPI,
	getRecentlyPlayedSongs,
} = require("../api/song/");

const { createUserSong, getSong } = require("../model");

const updateRecentSongs = async (user) => {
	const recentSongsAPI = await getRecentlyPlayedSongsFromAPI(user);
	const recentUserSongs = await getRecentlyPlayedSongs(user);
	const songsToAdd = recentSongsAPI.filter((song) => {
		const found = recentUserSongs.find((usersong) => {
			return usersong.id === song.id;
		});
		if (found !== undefined) {
			console.log(
				found.UserSongHistory.played_date,
				found.played_date,
				song.played_date
			);
		}

		return found === undefined || found.played_date !== song.played_date;
	});

	const addTasks = songsToAdd.map((songtoadd) => {
		return getSong(user.access_token, songtoadd.id).then((song) => {
			createUserSong(user, song, songtoadd.played_date);
		});
	});
	return Promise.all(addTasks).then(() => {
		return { error: false, message: "Songs updated" };
	});
};

module.exports = { updateRecentSongs };
