const { Op } = require("sequelize");
const { updateRecentSongs } = require("../../tasks/updateRecentSongs");
const { Song } = require("../../database");
const { formatSong } = require("../../model");

const myRecentResult = {};
let lastUpdated = Date.now();
const myRecentSongs = async (access_token, userId) => {
	if (!myRecentResult[access_token] || lastUpdated < Date.now() - 3600000) {
		myRecentResult[access_token] = null;
		await updateRecentSongs(access_token, userId);
		lastUpdated = now();
	}

	if (myRecentResult[access_token]) {
		return myRecentResult[access_token];
	}

	const oldRecent = await Song.findAll({
		where: {
			[Op.and]: [{ iduser: userId }, { removed: false }],
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
	return myRecentResult[access_token];
};

module.exports = { myRecentSongs };
