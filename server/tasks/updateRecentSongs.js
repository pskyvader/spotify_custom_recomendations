const { getRecentSongs } = require("../spotifyapi/song");

const { createUserSong } = require("../model");
const { getSong } = require("../api/song");

const updateRecentSongs = async (user) => {
	const recentSongsAPI = await getRecentSongs(user);
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
		return getSong(songtoadd.id, songtoadd).then((song) => {
			if (song.error) {
				console.error("ADDING TO HISTORY ERROR");
				console.error(song);
				return song;
			}
			return createUserSong(user, song, songtoadd.played_date);
		});
	});
	return Promise.all(addTasks)
		.then((responses) => {
			return {
				error: false,
				message: `${responses.length} Recent Songs updated`,
			};
		})
		.catch((err) => {
			return { error: true, message: err.message };
		});
};

module.exports = { updateRecentSongs };
