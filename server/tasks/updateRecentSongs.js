const { Op } = require("sequelize");
const { Song } = require("../database");
const { request } = require("../utils");
const { getSong } = require("../model");

const updateRecentSongs = async (access_token, iduser) => {
	const after = Date.now() - 604800000;
	const lastSong = await Song.findOne({
		where: {
			[Op.and]: [{ iduser: iduser }, { removed: false }],
		},
		order: [["updatedAt", "DESC"]],
	}).catch((err) => {
		console.error(err);
		return { error: err.message };
	});
	// check every 1 hour
	if (lastSong !== null && lastSong.updatedAt > Date.now() - 3600000) {
		console.log(
			"skip update recents, user:",
			iduser,
			"updated at",
			lastSong.updatedAt
		);
		return { error: "skip update recents" };
	}

	let url =
		"https://api.spotify.com/v1/me/player/recently-played?limit=50&after" +
		after;
	let items = [];

	while (url) {
		const response = await request(access_token, url);
		if (response.error) {
			console.log(response);
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
		await Song.update(
			{ song_last_played: newsong.played_at },
			{
				where: {
					[Op.and]: [{ iduser: iduser }, { id: currentSong.id }],
				},
			}
		).catch((err) => {
			console.error(err);
			return { error: err.message };
		});
	}
};

module.exports = { updateRecentSongs };
