const { request, formatSongList } = require("../utils");

let playlists = {};
let recommended = {};

const playlist = async (req, res) => {
	let result;
	switch (req.params.submodule) {
		case "recommended":
			result = await playlistrecommended(req, res);
			break;
		default:
			result = await playlistsongs(req, res);
			break;
	}
	res.json(result);
};

const playlistsongs = async (req, res) => {
	const playlistId = req.params.submodule;
	if (playlists[playlistId]) {
		return playlists[playlistId];
	}
	const url =
		"https://api.spotify.com/v1/playlists/" + playlistId + "/tracks";

	const response = await request(req, url);
	if (response.error) {
		return response;
	}

	playlists[playlistId] = formatSongList(response.items);

	return playlists[playlistId];
};

const playlistrecommended = async (req, res) => {
	const playlistId = req.params.extra;

	if (recommended[playlistId]) {
		return recommended[playlistId];
	}

	if (!playlists[playlistId]) {
		const url =
			"https://api.spotify.com/v1/playlists/" + playlistId + "/tracks";

		const response = await request(req, url);
		if (response.error) {
			console.log(response);
			return response;
		}
		playlists[playlistId] = formatSongList(response.items);
	}

	if (playlists[playlistId]) {
		const currentPlaylist = playlists[playlistId];
	}

	return recommended[playlistId];
};

module.exports = { playlist };
