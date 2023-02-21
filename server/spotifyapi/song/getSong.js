const { request } = require("../");
const { formatSong } = require("./formatSong");

const getSong = async (access_token, songId) => {
	let url = `https://api.spotify.com/v1/tracks/${songId}`;
	const response = await request(access_token, url);
	if (response.error) {
		return response;
	}

	return formatSong(response);
};

module.exports = { getSong };
