const { Op } = require("sequelize");
const { UserSongHistory, PlaylistSong } = require("../../database");

//week in ms
const week = 604800000;

const getRecommendedSongsToRemove = async (playlist) => {
	const oldAddedSongs = await playlist
		.getSongs({
			include: [
				UserSongHistory,
				{
					model: PlaylistSong,
					where: {
						active: true,
						add_date: {
							[Op.lte]: Date.now() - 1 * week,
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
	const recommendedForRemove = oldAddedSongs.filter((song) => {
		if (song.UserSongHistories.length === 0) {
			return true;
		}
		return song.UserSongHistories[0].played_date < Date.now() - 2 * week;
	});

	return recommendedForRemove.slice(0, 15);
};

module.exports = {
	getRecommendedSongsToRemove,
};
