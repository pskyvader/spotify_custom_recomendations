const { Op } = require("sequelize");
// const { updateRecentSongs } = require("../../tasks/updateRecentSongs");
const { Song, User } = require("../../database");
const { getUser, formatSong } = require("../../model");

const myRecentResult = {};
let lastGetResult = null;
const getMyRecentSongs = async (session) => {
	const currentUser = await getUser(session);
	const access_token = session.access_token;
	const userId = currentUser.id;

	if (myRecentResult[access_token] && lastGetResult > Date.now() - 3600000) {
		return myRecentResult[access_token];
	}
	// await updateRecentSongs(access_token, userId);
	const oldRecent = await Song.findAll({
		// where: {
		// 	song_last_played: {
		// 		[Op.ne]: null,
		// 	},
		// },
		include: {
			model: User,
			where: { id: userId },
		},
		through: {
			song_last_played: {
				[Op.ne]: null,
			},
		},
		// order: [["song_last_played", "DESC"]],
		raw: true,
		nest: true,
	}).catch((err) => {
		return { error: err.message };
	});

	// console.log("oldRecent", oldRecent);

	myRecentResult[access_token] = oldRecent.map((currentSong) => {
		currentSong.action = currentSong.song_last_played
			? currentSong.song_last_played.toLocaleString()
			: "";
		return formatSong(currentSong);
	});
	lastGetResult = Date.now();
	return myRecentResult[access_token];
};

module.exports = { getMyRecentSongs };
