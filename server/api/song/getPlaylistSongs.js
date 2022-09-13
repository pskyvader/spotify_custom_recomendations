const { PlaylistSong } = require("../../database");
const getPlaylistSongs = async (playlist) => {
	return playlist
		.getSongs({
			// raw: true,
			// nest: true,
			include: [
				{
					model: PlaylistSong,
					where: {
						active: true,
					},
					order: [["add_date", "ASC"]],
				},
			],
		})
		.catch((err) => {
			return { error: err.message };
		});
};

module.exports = { getPlaylistSongs };
