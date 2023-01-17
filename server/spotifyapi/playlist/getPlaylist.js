const { request } = require("../");
const { formatPlaylist } = require("./formatPlaylist");

const getPlaylist = (access_token, playlistId) => {
	return request(
		access_token,
		`https://api.spotify.com/v1/playlists/${playlistId}`
	).then((response) => {
		if (response.error) {
			console.log("Get playlist from API error", response);
			return response;
		}
		return formatPlaylist(response);
	});
};

module.exports = { getPlaylist };
