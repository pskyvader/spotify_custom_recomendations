const { Op } = require("sequelize");
// const { updateRecentSongs } = require("../../tasks/updateRecentSongs");
const { Song, UserSong } = require("../../database");
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
	const oldRecent = await UserSong.findAll({
		where: {
			UserId: userId,
			song_last_played: {
				[Op.ne]: null,
			},
		},
		order: [["song_last_played", "DESC"]],
		include: {
			model: Song,
		},
		raw: true,
		nest: true,
	}).catch((err) => {
		return { error: err.message };
	});
	myRecentResult[access_token] = oldRecent.map((currentUserSong) => {
		const currentSong = currentUserSong.Song;
		currentSong.action = currentUserSong.song_last_played
			? currentUserSong.song_last_played.toLocaleString()
			: "";
		return formatSong(currentSong);
	});
	lastGetResult = Date.now();
	return myRecentResult[access_token];
};

module.exports = { getMyRecentSongs };
