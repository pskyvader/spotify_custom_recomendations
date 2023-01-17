const { request } = require("../../spotifyapi/");

const addSong = async (access_token, playlistId, songId) => {
	const url =
		"https://api.spotify.com/v1/playlists/" + playlistId + "/tracks";
	const songs = { uris: [`spotify:track:${songId}`], position: 0 };

	return request(access_token, url, "POST", JSON.stringify(songs));
};

module.exports = { addSong };
