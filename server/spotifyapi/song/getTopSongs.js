const { request } = require("../");
const { formatSongGroup } = require("./formatSong");
const limit=50;

const getTopSongs = async (access_token) => {
	let url = `https://api.spotify.com/v1/me/top/tracks?limit=${limit}`; //&time_range=long_term
	let items = [];
	while (url && items.length<limit) {
		const response = await request(access_token, url);
		if (response.error) {
			console.log("Get top songs from API error", response);
			return response;
		}
		url = response.next;
		items.push(...response.items);
	}
	return formatSongGroup(items);
};

module.exports = { getTopSongs };
