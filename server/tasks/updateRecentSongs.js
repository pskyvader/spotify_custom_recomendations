const { Op } = require("sequelize");
const { Song, User } = require("../database");
const { request } = require("../utils");
const { getSong } = require("../model");

// variable week= 1 week in ms
const week = 604800000;

const lastUpdate = {};

const updateRecentSongs = async (access_token, userId) => {
	// check if last update is less than 10 minutes ago
	if (lastUpdate[userId] && lastUpdate[userId] > Date.now() - 600000) {
		return {
			error: false,
			message: "Songs updated less than 10 minutes ago",
		};
	}

	const after = Date.now() - week;
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

	const allsongs = await Song.findAll({ attributes: ["id"] });
	const allsongsIds = allsongs.map((song) => song.id);
	const songsToAdd = items.filter((song) => !allsongsIds.includes(song.id));

	for (const song of songsToAdd) {
		const songData = await getSong(access_token, song.track.id, userId);
		if (songData.error) {
			return songData;
		}
	}

	for (const newsong of items) {
		const updatingSong = await Song.findByPk(newsong.track.id, {
			include: { model: User, where: { id: userId } },
		});
		await updatingSong
			.addUser(userId, {
				through: {
					song_last_played: newsong.played_at,
					times_played: updatingSong.Users[0].UserSong
						? updatingSong.Users[0].UserSong.times_played + 1
						: 1,
				},
			})
			.catch((err) => {
				console.error(
					`Song Update, song ID:${newsong.track.id}, user :${userId}`,
					err,
					newsong.track
				);
				return { error: true, message: err.message };
			});
	}
	lastUpdate[userId] = Date.now();

	return { error: false, message: "Songs updated" };
};

module.exports = { updateRecentSongs };
