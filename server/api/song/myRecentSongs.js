const { Op } = require("sequelize");
const { updateRecentSongs } = require("../../tasks/updateRecentSongs");
const { Song, User } = require("../../database");
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

	const oldRecent = await Song.findAll({
		include: {
			model: User,
			where: { id: userId },
		},
		through: {
			where: {
				song_last_played: {
					[Op.gte]: Date.now() - week,
				},
			},
		},
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
