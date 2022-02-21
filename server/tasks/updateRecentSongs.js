const { Op } = require("sequelize");

const updateRecentSongs = async (session, iduser) => {
	const after = Date.now() - 604800000;
	const lastSong = await Song.findOne({
		where: {
			[Op.and]: [{ iduser: iduser }, { removed: false }],
		},
		order: [["song_added", "ASC"]],
	}).catch((err) => {
		return { error: err.message };
	});

	//check every 1 hour
	if (lastSong !== null && lastSong.song_added > Date.now() - 3600000) {
		return true;
	}

	let url =
		"https://api.spotify.com/v1/me/player/recently-played?after=" + after;
	let items = [];

	while (url) {
		const response = await request(session, url);
		if (response.error) {
			console.log(response);
			return response;
		}
		url = response.next;
		items.push(...response.items);
	}
	const newRecent = formatSongList(items);

	for (const newsong of newRecent) {
		const data = newsong;
		data.iduser = iduser;
		data.song_added = Date.now();
		await Song.upsert(data).catch((err) => {
			return { error: err.message };
		});
	}
};

module.exports = { updateRecentSongs };
