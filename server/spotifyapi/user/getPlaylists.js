const { request } = require("../request");
const { formatPlaylistGroup } = require("../playlist");

const getPlaylists = (
	access_token,
	playlists = [],
	url = "https://api.spotify.com/v1/me/playlists?limit=50"
) => {
	if (url) {
		return request(access_token, url).then((response) => {
			if (response.error) {
				console.log("Get playlist from API error", response);
				return response;
			}

			playlists.push(...formatPlaylistGroup(response.items));
			return getPlaylists(access_token, playlists, response.next);
		});
	}
	return playlists;
};

module.exports = { getPlaylists };
