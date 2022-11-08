const { Op } = require("sequelize");
const { UserSongHistory, PlaylistSong } = require("../../database");

//day in ms
const day = 86400000;

const getRecommendedSongsToRemove = async (playlist, minTime = null) => {
	const minTimeInPlaylist = day * (minTime && minTime > 0 ? minTime : 7);
	// day * (minTime && minTime > 0 ? Math.max(minTime, 7) : 7);
	const oldAddedSongs = await playlist
		.getSongs({
			include: [
				UserSongHistory,
				{
					model: PlaylistSong,
					where: {
						active: true,
						add_date: {
							[Op.lte]: Date.now() - 1 * minTimeInPlaylist,
						},
					},
				},
			],
			order: [
				[UserSongHistory, "played_date", "DESC"],
				[PlaylistSong, "add_date", "ASC"],
			],
		})
		.catch((err) => {
			return { error: err.message };
		});

	//never played songs
	const recommendedForRemove = oldAddedSongs.filter((song) => {
		return song.UserSongHistories.length === 0;
	});

	//never played + old played songs (over two * min time in playlist)
	if (recommendedForRemove.length < 15) {
		recommendedForRemove.push(
			...oldAddedSongs
				.filter((song) => {
					if (song.UserSongHistories.length === 0) {
						return false;
					}
					return (
						song.UserSongHistories[0].played_date <
						Date.now() - 2 * minTimeInPlaylist
					);
				})
				.reverse() // order from least to most recently played
		);
	}

	// only if there are no songs to remove
	if (recommendedForRemove.length === 0) {
		recommendedForRemove.push(
			...oldAddedSongs
				.filter((song) => {
					return (
						song.UserSongHistories[0].played_date <
						Date.now() - 1 * minTimeInPlaylist
					);
				})
				.reverse() // order from least to most recently played
		);
	}

	// only if there are still no songs to remove
	if (recommendedForRemove.length === 0) {
		recommendedForRemove.push(
			...oldAddedSongs.reverse().slice(0, 2) // order from least to most recently played,max 2 songs
		);
	}

	return recommendedForRemove.slice(0, 15);
};

module.exports = {
	getRecommendedSongsToRemove,
};
