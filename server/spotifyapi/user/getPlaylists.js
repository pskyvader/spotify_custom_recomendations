const { request } = require("../request");
const { formatPlaylistGroup } = require("../playlist");

const getPlaylists = (
	user,
	playlists = [],
	url = "https://api.spotify.com/v1/me/playlists?limit=10"
) => {
	if (url) {
		return request(user.access_token, url).then((response) => {
			if (response.error) {
				console.log("Get playlist from API error", response);
				return response;
			}

			playlists.push(...formatPlaylistGroup(response.items));
			return getPlaylists(user, playlists, response.next);
		});
	}
	return playlists;
};

module.exports = { getPlaylists };
