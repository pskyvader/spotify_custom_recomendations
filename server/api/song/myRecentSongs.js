const { Op } = require("sequelize");
const { updateRecentSongs } = require("../../tasks/updateRecentSongs");
const { Song, UserSong } = require("../../database");
const { formatSong } = require("../../model");

const myRecentResult = {};
let lastUpdated = null;
// variable week= 1 week in ms
const week = 604800000;
// variable day= 1 day in ms
// const day = 86400000;
// variable hour= 1 hour in ms
const hour = 3600000;

const myRecentSongs = async (access_token, userId) => {
	if (myRecentResult[access_token] && lastUpdated > Date.now() - hour) {
		return myRecentResult[access_token];
	}
	updateRecentSongs(access_token, userId); //asyncronous update

	const oldRecent = await UserSong.findAll({
		where: {
			UserId: userId,
			song_last_played: {
				[Op.gte]: Date.now() - 4 * week,
			},
		},
		order: [["song_last_played", "ASC"]],
		include: {
			model: Song,
		},
		raw: true,
		nest: true,
	}).catch((err) => {
		return { error: err.message };
	});
	myRecentResult[access_token] = oldRecent.map((currentUserSong) => {
		return formatSong(currentUserSong.Song), {};
	});
	lastUpdated = Date.now();
	return myRecentResult[access_token];
};

module.exports = { myRecentSongs };
