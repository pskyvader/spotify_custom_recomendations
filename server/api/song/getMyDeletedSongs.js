const { Op } = require("sequelize");
const { Song } = require("../../database");
const { getUser, formatSong } = require("../../model");

const myDeletedSongsResult = {};
let lastGetResult = null;
const getMyDeletedSongs = async (session, playlistId) => {
	const currentUser = await getUser(session);
	const access_token = session.access_token;
	const userId = currentUser.id;

	if (
		myDeletedSongsResult[access_token] &&
		lastGetResult > Date.now() - 3600000
	) {
		return myDeletedSongsResult[access_token];
	}

	const DeletedSongs = await Song.findAll({
		where: {
			[Op.and]: [
				{ iduser: userId },
				{
					removed: true,
				},
			],
		},
		order: [["song_removed", "DESC"]],
		raw: true,
		nest: true,
	}).catch((err) => {
		return { error: err.message };
	});
	myDeletedSongsResult[access_token] = DeletedSongs.map((currentSong) => {
		return formatSong(currentSong);
	});
	lastGetResult = Date.now();
	return myDeletedSongsResult[access_token];
};

module.exports = { getMyDeletedSongs };
