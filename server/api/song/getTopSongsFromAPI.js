const { request, formatSongAPIList } = require("../../utils");

const getTopSongsFromAPI = async (user) => {
	let url = "https://api.spotify.com/v1/me/top/tracks?limit=50"; //&time_range=long_term
	let items = [];
	while (url) {
		const response = await request(user.access_token, url);
		if (response.error) {
			console.log(response);
			return response;
		}
		url = response.next;
		items.push(...response.items);
	}
	return formatSongAPIList(items);
};

module.exports = { getTopSongsFromAPI };