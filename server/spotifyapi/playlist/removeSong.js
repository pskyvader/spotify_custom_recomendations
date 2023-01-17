const { request } = require("../../spotifyapi/");

const removeSong = async (access_token, playlistId, songId) => {
	const url =
		"https://api.spotify.com/v1/playlists/" + playlistId + "/tracks";
	const songs = {
		tracks: [{ uri: `spotify:track:${songId}` }],
	};

	return request(access_token, url, "DELETE", JSON.stringify(songs));
};

module.exports = { removeSong };
