const { Op } = require("sequelize");

const { request, formatSongList } = require("../utils");

const { Song } = require("../database/connection");

const updateRecentlyPlayed = async (
	req,
	res,
	iduser,
	after = Date.now() - 604800000,
	limit = 10
) => {
	const lastSong = await Song.findOne({
		where: {
			[Op.and]: [{ iduser: iduser }, { removed: false }],
		},
		order: [["song_added", "ASC"]],
	}).catch((err) => {
		return { error: err.message };
	});

	//check every 1 hour
	if (lastSong!==null && lastSong.song_added > Date.now() - 3600000) {
		return true;
	}

	let url =
		"https://api.spotify.com/v1/me/player/recently-played?limit=" +
		limit +
		"&after=" +
		after;
	let items = [];

	while (url) {
		const response = await request(req, url);
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

const updateRecentlyDeleted = async (req, res, iduser) => {
	await Song.destroy({
		where: {
			[Op.and]: [
				{ iduser: iduser },
				{ removed: true },
				{ song_added: { [Op.lt]: Date.now() - 604800000 } },
			],
		},
	}).catch((err) => {
		return { error: err.message };
	});
};

module.exports = { updateRecentlyPlayed, updateRecentlyDeleted };
