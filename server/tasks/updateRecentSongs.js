const { getRecentlyPlayedSongsFromAPI } = require("../api/song/");

const { createUserSong, getSong } = require("../model");

const updateRecentSongs = async (user) => {
	const recentSongsAPI = await getRecentlyPlayedSongsFromAPI(user);
	const userSongHistory = await user.getUserSongHistories();
	const songsToAdd = recentSongsAPI.filter((song) => {
		song.played_date = new Date(song.played_date).getTime();
		const found = userSongHistory.find((history) => {
			return (
				history.SongId === song.id &&
				history.played_date.getTime() === song.played_date
			);
		});
		return found === undefined;
	});

	const addTasks = songsToAdd.map((songtoadd) => {
		return getSong(user.access_token, songtoadd.id).then((song) => {
			return createUserSong(user, song, songtoadd.played_date);
		});
	});
	return Promise.all(addTasks).then(() => {
		return { error: false, message: "Songs updated" };
	});
};

module.exports = { updateRecentSongs };
