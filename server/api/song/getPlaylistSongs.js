const { Op } = require("sequelize");
const { PlaylistSong } = require("../../database");
const getPlaylistSongs = async (playlist, date = Date.now()) => {
	return playlist
		.getSongs({
			// raw: true,
			// nest: true,
			where: {
				add_date: { [Op.lte]: date },
			},
			include: [
				{
					model: PlaylistSong,
					where: {
						active: true,
					},
				},
			],
			order: [[PlaylistSong, "add_date", "ASC"]],
		})
		.catch((err) => {
			console.error("getPlaylistSongs error", err);
			return { error: err.message };
		});
};

module.exports = { getPlaylistSongs };
