const { request, formatSongList } = require("../utils");

let playlists = {};

const playlist = async (req, res) => {
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
