const { Op } = require("sequelize");
const { Song } = require("../../database");

const getNostalgicSongs = async (user, playlist) => {
	const monthMs = 30 * 24 * 60 * 60 * 1000;
	// Songs removed more than 2 months ago
	const maxRemovalDate = new Date(Date.now() - 2 * monthMs);

	const removedPlaylistSongs = await playlist.getPlaylistSongs({
		where: {
			active: false,
			nostalgic: true,
			removed_date: {
				[Op.lte]: maxRemovalDate,
			},
		},
		include: [Song],
	});

	if (!removedPlaylistSongs || removedPlaylistSongs.length === 0) return [];

	const nostalgicSongs = removedPlaylistSongs.map((ps) => ps.Song);

	return nostalgicSongs;
};

module.exports = { getNostalgicSongs };
