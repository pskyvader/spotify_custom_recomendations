const { request } = require("../");

const getPlaylist = (access_token, idplaylist) => {
	return request(
		access_token,
		`https://api.spotify.com/v1/playlists/${idplaylist}`
	);
};

module.exports = { getPlaylist };
