const { getRecentSongs } = require("../spotifyapi/song");
const { createUserSong } = require("../model");
const { getSong } = require("../api/song");
const { log, info, error } = require("../utils/logger");

const updateRecentSongs = async (user) => {
	try {
		log("Fetching recent songs from Spotify API", { userId: user.id });

		const recentSongsAPI = await getRecentSongs(user);

		log("Fetching user song history from database", { userId: user.id });

		const userSongHistory = await user.getUserSongHistories();

		log("Comparing API songs with local history", {
			userId: user.id,
			apiSongs: recentSongsAPI.length,
			historyCount: userSongHistory.length,
		});

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

		info("Found new songs to add to history", {
			userId: user.id,
			newSongs: songsToAdd.length,
		});

		const addTasks = songsToAdd.map((songtoadd) => {
			return getSong(user.access_token, songtoadd.id, songtoadd).then(
				(song) => {
					if (song.error) {
						error("Failed to get song details", {
							userId: user.id,
							songId: songtoadd.id,
							error: song,
						});
						return song;
					}
					return createUserSong(user, song, songtoadd.played_date);
				}
			);
		});

		const responses = await Promise.all(addTasks);

		const successCount = responses.filter((r) => !r.error).length;

		info("updateRecentSongs completed", {
			userId: user.id,
			addedCount: successCount,
			failedCount: responses.length - successCount,
		});

		return {
			error: false,
			addedCount: successCount,
			failedCount: responses.length - successCount,
		};
	} catch (err) {
		error("updateRecentSongs failed", {
			userId: user.id,
			error: err.message,
		});
		return { error: true };
	}
};

module.exports = { updateRecentSongs };
