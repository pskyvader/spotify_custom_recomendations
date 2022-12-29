const { request } = require("../");
const { formatPlaylist } = require("./formatPlaylist");

const getPlaylist = (access_token, idplaylist) => {
	return request(
		access_token,
		`https://api.spotify.com/v1/playlists/${idplaylist}`
	).then((response) => {
		if (response.error) {
			console.log("Get playlist from API error", response);
			return response;
		}
		return formatPlaylist(response);
	});
};

module.exports = { getPlaylist };
