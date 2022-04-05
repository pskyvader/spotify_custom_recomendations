const { Op } = require("sequelize");
const { updateRecentSongs } = require("../../tasks/updateRecentSongs");
const { Song, User } = require("../../database");
const { formatSong } = require("../../model");

const myRecentResult = {};
let lastUpdated = null;
const myRecentSongs = async (access_token, userId) => {
	if (myRecentResult[access_token] && lastUpdated > Date.now() - 3600000) {
		return myRecentResult[access_token];
	}
	await updateRecentSongs(access_token, userId);

	const oldRecent = await Song.findAll({
		where: { song_last_played: { [Op.lt]: Date.now() - 86400000 } },

		include: {
			model: User,
			where: { id: userId },
		},
		order: [["song_last_played", "DESC"]],
		raw: true,
		nest: true,
	}).catch((err) => {
		return { error: err.message };
	});
	myRecentResult[access_token] = oldRecent.map((currentSong) =>
		formatSong(currentSong)
	);
	lastUpdated = Date.now();
	return myRecentResult[access_token];
};

module.exports = { myRecentSongs };
