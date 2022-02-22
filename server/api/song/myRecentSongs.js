const { Op } = require("sequelize");
const { updateRecentSongs } = require("../../tasks/updateRecentSongs");
const { Song } = require("../../database");
const myRecentResult = {};
const myRecentSongs = async (access_token, userId) => {
	if (myRecentResult[access_token]) {
		return myRecentResult[access_token];
	}
	await updateRecentSongs(access_token, userId);

	const oldRecent = await Song.findAll({
		where: {
			[Op.and]: [{ iduser: userId }, { removed: false }],
		},
		order: [["song_added", "ASC"]],
		raw: true,
		nest: true,
	}).catch((err) => {
		return { error: err.message };
	});

	myRecentResult[access_token] = oldRecent.map((currentSong) =>
		formatSong(currentSong)
	);
	return myRecentResult[access_token];
};

module.exports = { myRecentSongs };
