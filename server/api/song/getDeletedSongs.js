const getDeletedSongs = async (playlist) => {
	return playlist
		.getSongs({
			where: {
				removed: true,
			},
			order: [["removed_date", "DESC"]],
			// raw: true,
			// nest: true,
		})
		.catch((err) => {
			return { error: err.message };
		});
};

module.exports = { getDeletedSongs };
