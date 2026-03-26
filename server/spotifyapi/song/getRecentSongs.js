const { request } = require("../");
const { formatSong } = require("./formatSong");
conat {log}=require("../../utils/logger");

const week = 604800000;

const getRecentSongs = async (user) => {
	const after = Date.now() - week;
	let url =
		"https://api.spotify.com/v1/me/player/recently-played?limit=50&after" +
		after;
	let items = [];

	while (url) {
		const response = await request(user.access_token, url);
		if (response.error) {
			log(`get recent songs error for user {user} : {response}`);
			return response;
			
		}
		url = response.next;
		items.push(...response.items);
	}

	return items.map((song) => {
		const formatted = formatSong(song.track);
		formatted.played_date = song.played_at;
		return formatted;
	});
};

module.exports = { getRecentSongs };
