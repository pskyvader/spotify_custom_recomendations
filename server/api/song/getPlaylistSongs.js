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
					// order: [["add_date", "ASC"]],
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
