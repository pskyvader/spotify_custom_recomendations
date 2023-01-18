const { Op } = require("sequelize");
const { PlaylistSong } = require("../../database");
const getPlaylistSongs = async (playlist, date = Date.now()) => {
	return playlist
		.getSongs({
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
			return { error: true, messages: err.message };
		});
};

module.exports = { getPlaylistSongs };
