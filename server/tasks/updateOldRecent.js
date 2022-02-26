const { Op } = require("sequelize");
const { Song } = require("../database");
const updateOldRecent = async () => {
	await Song.update(
		{ removed: true, song_removed: Date.now() },
		{
			where: {
				[Op.and]: [
					{ removed: false },
					{ song_last_played: { [Op.lt]: Date.now() - 604800000 } },
				],
			},
		}
	).catch((err) => {
		return { error: err.message };
	});
};

module.exports = { updateOldRecent };
