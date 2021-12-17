const { request, formatSongList } = require("../utils");

let playlists = {};

const playlist = (req, res) => {
	switch (req.params.submodule) {
		case "recommended":
			playlistrecommended(req, res);
			break;
		default:
			playlistsongs(req, res);
			break;
	}
};

const playlistsongs = async (req, res) => {
	console.log(req.params);
	const playlistId = req.params.submodule;
	if (playlists[playlistId]) {
		res.json(playlists[playlistId]);
		return;
	}
	const url =
		"https://api.spotify.com/v1/playlists/" + playlistId + "/tracks";

	const response = await request(req, url);
	if (response.error) {
		console.log(response);
		res.json(response);
		return;
	}

	playlists[playlistId] = formatSongList(response.items);

	res.json(playlists[playlistId]);
};

const playlistrecommended = async (req, res) => {
	console.log(req.params);
	const playlistId = req.params.submodule;
	if (playlists[playlistId]) {
		res.json(playlists[playlistId]);
		return;
	}
	const url =
		"https://api.spotify.com/v1/playlists/" + playlistId + "/tracks";

	const response = await request(req, url);
	if (response.error) {
		console.log(response);
		res.json(response);
		return;
	}

	playlists[playlistId] = formatSongList(response.items);

	res.json(playlists[playlistId]);
};

module.exports = { playlist };
