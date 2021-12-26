const { request, formatSongList, subtractById } = require("../utils");
const { meTop, MeRecently } = require("./me");

const { recommended: recommendedSongs } = require("./recommended");

let playlists = {};
let recommended = {};
let deleterecommended = {};

const playlist = async (req, res) => {
	let result;
	switch (req.params.action) {
		case "recommended":
			result = await playlistRecommended(req, res);
			break;
		case "deleterecommended":
			result = await playlistDeleteRecommended(req, res);
			break;
		case "get":
			result = await playlistsongs(req, res);
			break;
		default:
			result = {
				error: "Invalid module",
			};
			break;
	}
	res.json(result);
};

const invalidatePlaylist = (playlistId, songUri) => {
	if (playlists[playlistId]) {
		delete playlists[playlistId];
	}
	if (recommended[playlistId]) {
		recommended[playlistId] = recommended[playlistId].filter(
			(song) => song.action !== songUri
		);
		if (recommended[playlistId].length < 10) {
			delete recommended[playlistId];
		}
	}

	if (deleterecommended[playlistId]) {
		deleterecommended[playlistId] = deleterecommended[playlistId].filter(
			(song) => song.action !== songUri
		);
		if (deleterecommended[playlistId].length < 10) {
			delete deleterecommended[playlistId];
		}
	}
	return true;
};

const playlistsongs = async (req, res) => {
	const playlistId = req.params.playlistid;
	if (playlists[playlistId]) {
		return playlists[playlistId];
	}
	let url =
		"https://api.spotify.com/v1/playlists/" + playlistId + "/tracks";

	let items=[];
	while(url){
		const response = await request(req, url);
		if (response.error) {
			return response;
		}
		url=response.next;
		items.push(...response.items);
	}
	

	playlists[playlistId] = formatSongList(items);

	return playlists[playlistId];
};

const playlistRecommended = async (req, res) => {
	const playlistId = req.params.playlistid;

	if (recommended[playlistId]) {
		return recommended[playlistId];
	}

	const currentPlaylist = await playlistsongs(req, res);
	if (currentPlaylist.error) {
		return currentPlaylist;
	}
	const topSongs = await meTop(req, res);
	if (topSongs.error) {
		return topSongs;
	}

	const recommendedTrack = await recommendedSongs(
		req,
		currentPlaylist,
		topSongs
	);
	if (recommendedTrack.error) {
		return recommendedTrack;
	}
	recommended[playlistId] = recommendedTrack;
	return recommended[playlistId];
};

const playlistDeleteRecommended = async (req, res) => {
	const playlistId = req.params.playlistid;

	if (deleterecommended[playlistId]) {
		return deleterecommended[playlistId];
	}

	const currentPlaylist = await playlistsongs(req, res);
	if (currentPlaylist.error) {
		return currentPlaylist;
	}

	const recentSongs = await MeRecently(req, res, 0);
	if (recentSongs.error) {
		return recentSongs;
	}
	return subtractById(currentPlaylist, recentSongs);
};

module.exports = { playlist, invalidatePlaylist };
