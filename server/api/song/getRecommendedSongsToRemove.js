const { Op } = require("sequelize");
const { UserSongHistory, PlaylistSong } = require("../../database");

//week in ms
const week = 604800000;

const getRecommendedSongsToRemove = async (user, playlist) => {
	const neverPlayedSongs = await user.getSongs({
		include: [
			{
				model: UserSongHistory,
				where: {
					played_date: null,
				},
			},
		],
	});
	const oldPlayedSongs = await user.getSongs({
		include: [
			{
				model: UserSongHistory,
				where: {
					played_date: {
						[Op.lte]: Date.now() - 3 * week,
					},
				},
				order: [["played_date", "ASC"]],
			},
		],
	});
	neverPlayedSongs.push(...oldPlayedSongs);

	const oldAddedSongs = await playlist
		.getSongs({
			include: [
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
		})
		.then((oldsongs) => oldsongs.map((song) => song.id));

	const recommendedForRemove = neverPlayedSongs.filter((song) =>
		oldAddedSongs.includes(song.Song.id)
	);

	return recommendedForRemove.slice(0, 15);
};

module.exports = {
	getRecommendedSongsToRemove,
};
