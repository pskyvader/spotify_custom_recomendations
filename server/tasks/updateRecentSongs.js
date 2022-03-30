const { Op } = require("sequelize");
const { Song } = require("../database");
const { request } = require("../utils");
const { getSong } = require("../model");

const updateRecentSongs = async (access_token, iduser) => {
	const after = Date.now() - 604800000;
	let url =
		"https://api.spotify.com/v1/me/player/recently-played?limit=50&after" +
		after;
	let items = [];

	while (url) {
		const response = await request(access_token, url);
		if (response.error) {
			return response;
		}
		url = response.next;
		items.push(...response.items);
	}

	for (const newsong of items) {
		const currentSong = await getSong(
			access_token,
			newsong.track.id,
			iduser
		);
		if (currentSong.error) {
			return currentSong;
		}
		await Song.update(
			{ song_last_played: newsong.played_at },
			{
				where: {
					[Op.and]: [{ iduser: iduser }, { id: currentSong.id }],
				},
			}
		).catch((err) => {
			console.error(
				`Song Update, song ID:${currentSong.id}, user :${iduser}`,
				err,
				currentSong
			);
			return { error: true, message: err.message };
		});
	}

	return { error: false, message: "Songs updated" };
};

module.exports = { updateRecentSongs };
