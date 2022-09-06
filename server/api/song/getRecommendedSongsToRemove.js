const { Op } = require("sequelize");

//week in ms
const week = 604800000;

const getRecommendedSongsToRemove = async (user, playlist) => {
	const NeverPlayedSongs = await user.getSongs({
		where: {
			played_date: null,
		},
	});
	const OldPlayedSongs = await user.getSongs({
		where: {
			played_date: {
				[Op.lte]: Date.now() - 3 * week,
			},
		},
		order: [["played_date", "ASC"]],
	});
	neverPlayedSongs.push(...OldPlayedSongs);

	const OldAddedSongs = await playlist
		.getSongs({
			where: {
				add_date: {
					[Op.lte]: Date.now() - 1 * week,
				},
			},
			// raw: true,
			// nest: true,
		})
		.catch((err) => {
			return { error: err.message };
		})
		.then(oldsongs.map((song) => song.id));

	const recommendedForRemove = NeverPlayedSongs.filter((song) =>
		OldAddedSongs.includes(song.Song.id)
	);

	return recommendedForRemove.slice(0, 15);
};

module.exports = {
	getRecommendedSongsToRemove,
};
