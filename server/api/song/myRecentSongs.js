const { Op } = require("sequelize");
const myRecentSongs = async (session) => {
	const currentUser = await getUser(session);
	if (currentUser.error) {
		return currentUser;
	}
	const access_token = session.access_token;

	if (meRecentResult[access_token]) {
		return meRecentResult[access_token];
	}

	const iduser = currentUser.id;

	await updateRecentlyPlayed(session, iduser);

	const oldRecent = await Song.findAll({
		where: {
			[Op.and]: [{ iduser: iduser }, { removed: false }],
		},
		order: [["song_added", "ASC"]],
		raw: true,
		nest: true,
	}).catch((err) => {
		return { error: err.message };
	});

	meRecentResult[access_token] = oldRecent.map((currentSong) =>
		formatSong(currentSong)
	);
	return meRecentResult[access_token];
};

module.exports = { myRecentSongs };
