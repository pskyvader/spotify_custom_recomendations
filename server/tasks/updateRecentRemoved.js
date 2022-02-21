const { Op } = require("sequelize");
const updateRecentRemoved = async (req, res, iduser) => {
	await Song.destroy({
		where: {
			[Op.and]: [
				{ iduser: iduser },
				{ removed: true },
				{ song_added: { [Op.lt]: Date.now() - 604800000 } },
			],
		},
	}).catch((err) => {
		return { error: err.message };
	});
};

module.exports = { updateRecentRemoved };
