const { Op } = require("sequelize");
const { UserSong } = require("../database");
const deleteOldRemoved = async () => {
	return UserSong.destroy({
		where: {
			[Op.and]: [
				{ removed: true },
				{ song_removed: { [Op.lt]: Date.now() - 604800000 } },
			],
		},
		raw: true,
		nest: true,
	}).catch((err) => {
		return { error: err.message };
	});
};

module.exports = { deleteOldRemoved };
