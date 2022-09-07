const { Op } = require("sequelize");
const { UserSong } = require("../database");
//week in ms
const week = 604800000;
const deleteGarbage = async () => {
	return UserSong.destroy({
		where: {
			[Op.and]: [
				{ removed: true },
				{ song_removed: { [Op.lt]: Date.now() - 2 * week } },
			],
		},
		raw: true,
		nest: true,
	}).catch((err) => {
		return { error: err.message };
	});
};

module.exports = { deleteGarbage };
