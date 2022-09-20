const { Song } = require("../../database");
const getDeletedSongs = async (playlist) => {
	return playlist
		.getPlaylistSongs({
			where: {
				active: false,
			},
			order: [["removed_date", "DESC"]],
			include: [Song],

			// raw: true,
			// nest: true,
		})
		.catch((err) => {
			return { error: err.message };
		});
};

module.exports = { getDeletedSongs };
