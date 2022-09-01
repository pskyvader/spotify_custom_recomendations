const { Op } = require("sequelize");

//week in ms
const week = 604800000;

const getRecommendedSongsToRemove = async (playlist) => {
	const NeverPlayedSongs = await playlist
		.getSongs({
			where: {
				last_played: {
					[Op.eq]: null,
				},
				song_added: {
					[Op.lte]: Date.now() - 2 * week,
				},
			},
			order: [["times_played", "ASC"]],
			// raw: true,
			// nest: true,
		})
		.catch((err) => {
			return { error: err.message };
		});

	if (NeverPlayedSongs.length >= 15) {
		return NeverPlayedSongs;
	}

	const OldPlayedSongs = await playlist
		.getSongs({
			where: {
				last_played: {
					[Op.lte]: Date.now() - 3 * week,
				},
				song_added: {
					[Op.lte]: Date.now() - 2 * week,
				},
			},
			order: [
				["times_played", "ASC"],
				["last_played", "ASC"],
			],
			limit: 15,
			// raw: true,
			// nest: true,
		})
		.catch((err) => {
			return { error: err.message };
		});

	const OldPlayedPlaylist = OldPlayedSongs.filter((song) =>
		currentPlaylistIds.includes(song.Song.id)
	);

	NeverPlayedSongs.push(...OldPlayedPlaylist);
	return NeverPlayedSongs;
};

module.exports = {
	getRecommendedSongsToRemove,
};
