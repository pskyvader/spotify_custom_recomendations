const { Op } = require("sequelize");
const { PlaylistSong } = require("../../database");

//one week in ms
const week = 604800000;

const getRecentlyAddedSongs = (playlist) => {
	return playlist
		.getSongs({
			include: [
				{
					model: PlaylistSong,
					where: {
						add_date: {
							[Op.gte]: Date.now() - 2 * week,
						},
					},
					// order: [["add_date", "ASC"]],
				},
			],
			order: [[PlaylistSong, "add_date", "ASC"]],

			// raw: true,
			// nest: true,
		})
		.catch((err) => {
			return { error: err.message };
		});
};

module.exports = { getRecentlyAddedSongs };
