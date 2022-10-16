const { Op } = require("sequelize");
const { PlaylistSong } = require("../../database");
const getPlaylistSongs = async (playlist, date = Date.now()) => {
	return playlist
		.getSongs({
			// raw: true,
			// nest: true,
			include: [
				{
					model: PlaylistSong,
					where: {
						active: true,
						add_date: { [Op.lte]: date },
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
