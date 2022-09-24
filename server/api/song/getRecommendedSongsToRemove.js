const { Op } = require("sequelize");
const { UserSongHistory, PlaylistSong } = require("../../database");

//week in ms
const week = 604800000;

const getRecommendedSongsToRemove = async (user, playlist) => {
	// const neverPlayedSongs = await user.getSongs({
	// 	include: [
	// 		{
	// 			model: UserSongHistory,
	// 			where: {
	// 				played_date: null,
	// 			},
	// 		},
	// 	],
	// });
	// const oldPlayedSongs = await user.getSongs({
	// 	include: [
	// 		{
	// 			model: UserSongHistory,
	// 			where: {
	// 				played_date: {
	// 					[Op.lte]: Date.now() - 3 * week,
	// 				},
	// 			},
	// 			order: [["played_date", "ASC"]],
	// 		},
	// 	],
	// });
	// neverPlayedSongs.push(...oldPlayedSongs);

	const oldAddedSongs = await playlist
		.getSongs({
			include: [
				{
					model: UserSongHistory,
					order: [["played_date", "DESC"]],
				},
				{
					model: PlaylistSong,
					where: {
						add_date: {
							[Op.lte]: Date.now() - 1 * week,
						},
					},
				},
			],
			// raw: true,
			// nest: true,
		})
		.catch((err) => {
			return { error: err.message };
		});

	const recommendedForRemove = oldAddedSongs.filter((song) => {
		if (song.UserSongHistories.length === 0) {
			return true;
		}
		console.log(
			"recommendedForRemove",
			song.UserSongHistories[0].played_date < Date.now() - 2 * week,
			song.UserSongHistories[0].id,
			song.UserSongHistories.map((history) => ({
				id: history.id,
				played_date: history.played_date,
			}))
		);
		return song.UserSongHistories[0].played_date < Date.now() - 2 * week;
	});

	return recommendedForRemove.slice(0, 15);
};

module.exports = {
	getRecommendedSongsToRemove,
};
