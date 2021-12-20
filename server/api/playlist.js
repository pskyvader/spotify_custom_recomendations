const { request, formatSongList } = require("../utils");
const { meTop } = require("./me");

const { recommended: recommendedSongs } = require("./recommended");

let playlists = {};
let recommended = {};

const playlist = async (req, res) => {
	let result;
	switch (req.params.submodule) {
		case "recommended":
			result = await playlistRecommended(req, res);
			break;
		default:
			result = await playlistsongs(req, res);
			break;
	}
	res.json(result);
};

const invalidatePlaylist = (playlistId) => {
	if(playlists[playlistId]){
		delete playlists[playlistId];
	}
	return true;
}

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

const playlistRecommended = async (req, res) => {
	const playlistId = req.params.extra;

	if (recommended[playlistId]) {
		return recommended[playlistId];
	}

	if (!playlists[playlistId]) {
		const url =
			"https://api.spotify.com/v1/playlists/" + playlistId + "/tracks";

		const response = await request(req, url);
		if (response.error) {
			return response;
		}
		playlists[playlistId] = formatSongList(response.items);
	}


	const currentPlaylist = playlists[playlistId];
	const topSongs = await meTop(req, res);
	recommended[playlistId]= await recommendedSongs(req, currentPlaylist, topSongs);
	
	return recommended[playlistId];
};

module.exports = { playlist ,invalidatePlaylist};
