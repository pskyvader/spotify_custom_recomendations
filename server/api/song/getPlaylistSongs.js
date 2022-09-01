const getPlaylistSongs = async (playlist) => {
	return playlist
		.getSongs({
			where: {
				removed: false,
			},
			order: [["song_added", "ASC"]],
			// raw: true,
			// nest: true,
		})
		.catch((err) => {
			return { error: err.message };
		});
};

module.exports = { getPlaylistSongs };
