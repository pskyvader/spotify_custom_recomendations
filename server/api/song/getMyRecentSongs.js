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
	const oldRecent = await Song.findAll({
		include: {
			model: User,
			where: { id: userId },
		},
		through: {
			where: {
				song_last_played: {
					[Op.ne]: null,
				},
			},
		},
		raw: true,
		nest: true,
	}).catch((err) => {
		return { error: err.message };
	});

	myRecentResult[access_token] = oldRecent.map((currentSong) => {
		currentSong.action = currentSong.Songs[0].UserSong.song_last_played
			? currentSong.Songs[0].UserSong.song_last_played.toLocaleString()
			: "";
		return formatSong(currentSong);
	});
	lastGetResult = Date.now();
	return myRecentResult[access_token];
};

module.exports = { getMyRecentSongs };
