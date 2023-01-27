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
				},
			],
			order: [[PlaylistSong, "removed_date", "DESC"]],
		})
		.catch((err) => {
			console.error("getDeletedSongs error", err);
			return { error: true, messages: err.message };
		});
};

module.exports = { getDeletedSongs };
