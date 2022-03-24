const { Op } = require("sequelize");
const { Song } = require("../database");
const deleteOldRemoved = async () => {
	return Song.destroy({
		where: {
			[Op.and]: [
				{ removed: true },
				{ song_removed: { [Op.lt]: Date.now() - 604800000 } },
			],
		},
	}).catch((err) => {
		return { error: err.message };
	});
};

module.exports = { deleteOldRemoved };
