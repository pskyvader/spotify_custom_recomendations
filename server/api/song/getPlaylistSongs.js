const getPlaylistSongs = async (playlist) => {
	return playlist
		.getSongs({
			where: {
				active: true,
			},
			order: [["add_date", "ASC"]],
			// raw: true,
			// nest: true,
		})
		.catch((err) => {
			return { error: err.message };
		});
};

module.exports = { getPlaylistSongs };
