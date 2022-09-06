const {
	getRecentlyPlayedSongsFromAPI,
	getRecentlyPlayedSongs,
} = require("../api/song/");
// variable week= 1 week in ms
const week = 604800000;

const updateRecentSongs = async (user) => {
	const recentSongsAPI = await getRecentlyPlayedSongsFromAPI(user);
	const recentUserSongs = await getRecentlyPlayedSongs(user);
	// const allsongsIds = recentUserSongs.map((usersong) => usersong.song.id);
	const songsToAdd = recentSongsAPI.filter((song) => {
		const found = recentUserSongs.find((usersong) => {
			return usersong.song.id === song.id;
		});
		return found === undefined || found.played_date !== song.played_date;
	});

	for (const song of songsToAdd) {
		const songData = await getSong(access_token, song.track.id, userId);
		if (songData.error) {
			return songData;
		}
	}

	for (const newsong of items) {
		const updatingSong = await Song.findByPk(newsong.track.id, {
			include: { model: User, where: { id: userId } },
		});

		const newDate = newsong.played_at;
		let newTimesPlayed = 1;
		if (updatingSong.Users[0].UserSong) {
			newTimesPlayed = updatingSong.Users[0].UserSong.times_played;
			if (updatingSong.Users[0].UserSong.song_last_played !== newDate) {
				newTimesPlayed += 1;
			}
		}

		await updatingSong
			.addUser(userId, {
				through: {
					song_last_played: newDate,
					times_played: newTimesPlayed,
				},
			})
			.catch((err) => {
				console.error(
					`Song Update, song ID:${newsong.track.id}, user :${userId}`,
					err,
					newsong.track
				);
				return { error: true, message: err.message };
			});
	}
	lastUpdate[userId] = Date.now();

	return { error: false, message: "Songs updated" };
};

module.exports = { updateRecentSongs };
