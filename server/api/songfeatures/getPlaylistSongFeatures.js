const { PlaylistSong, SongFeatures } = require("../../database");

const getPlaylistSongFeatures = async (playlist) => {
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
				},
				SongFeatures,
			],
			order: [[PlaylistSong, "add_date", "ASC"]],
		})
		.catch((err) => {
			console.error("getPlaylistSongs error", err);
			return { error: err.message };
		});
};

module.exports = { getPlaylistSongFeatures };
