const { Op } = require("sequelize");
const { updateRecentSongs } = require("../../tasks/updateRecentSongs");
const { Song } = require("../../database");
const { getUser, formatSong } = require("../../model");

const myRecentResult = {};
const getMyRecentSongs = async (session) => {
	const currentUser = await getUser(session);
	const access_token = session.access_token;
	const userId = currentUser.id;

	if (myRecentResult[access_token]) {
		return myRecentResult[access_token];
	}
	await updateRecentSongs(access_token, userId);

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

	myRecentResult[access_token] = oldRecent.map((currentSong) => {
		console.log(currentSong.song_last_played, currentSong.song_added);
		currentSong.action = currentSong.song_last_played.toLocaleString();
		return formatSong(currentSong);
	});
	return myRecentResult[access_token];
};

module.exports = { getMyRecentSongs };