const { request } = require("../utils");

const { invalidatePlaylist } = require("./playlist");

const actions = async (req, res) => {
	let result;
	switch (req.params.module) {
		case "add":
			result = await add(req, res);
			break;
		// case "top":
		// 	result = await meTop(req, res);
		// 	break;
		default:
			result = {
				error: "Unknown module",
			};
			break;
	}
	res.json(result);
};

const add = async (req, res) => {
	const playlistId = req.params.playlistid;
	const songuri = req.params.songuri;
	const url =
		"https://api.spotify.com/v1/playlists/" + playlistId + "/tracks";
	const songs = { uris: [songuri], position: 0 };

	const response = await request(req, url, "POST", JSON.stringify(songs));
	if (response.error) {
		return response;
	}

	invalidatePlaylist(playlistId);

	return {
		message: "success",
		snapshot_id: response.snapshot_id,
	};
};

module.exports = { actions };
