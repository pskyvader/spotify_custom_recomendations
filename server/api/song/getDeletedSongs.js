const { PlaylistSong } = require("../../database");
const getDeletedSongs = async (playlist) => {
	return playlist
		.getSongs({
			include: [
				{
					model: PlaylistSong,
					where: {
						active: false,
					},
					order: [["removed_date", "DESC"]],
				},
			],

			// raw: true,
			// nest: true,
		})
		.catch((err) => {
			return { error: err.message };
		});
};

module.exports = { getDeletedSongs };
