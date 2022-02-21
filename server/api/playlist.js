const { request, subtractById } = require("../utils");
const { meTop, MeRecently } = require("./me");

const { recommended: recommendedSongs } = require("./recommended");
const { formatSongList } = require("../model");

let playlists = {};
let recommended = {};
let deleterecommended = {};

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

const playlistsongs = async (session, playlistId) => {
	if (playlists[playlistId]) {
		return playlists[playlistId];
	}
	let url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
	let items = [];
	while (url) {
		const response = await request(session, url);
		if (response.error) {
			return response;
		}
		url = response.next;
		items.push(...response.items);
	}

	playlists[playlistId] = formatSongList(items);

	return playlists[playlistId];
};

const playlistRecommended = async (req) => {
	const playlistId = req.params.playlistid;
	const session = req.session;

	if (recommended[playlistId]) {
		return recommended[playlistId];
	}

	const currentPlaylist = await playlistsongs(session, playlistId);
	if (currentPlaylist.error) {
		return currentPlaylist;
	}
	const topSongs = await meTop(session);
	if (topSongs.error) {
		return topSongs;
	}

	const recommendedTrack = await recommendedSongs(
		session,
		currentPlaylist,
		topSongs
	);
	if (recommendedTrack.error) {
		return recommendedTrack;
	}
	recommended[playlistId] = recommendedTrack;
	return recommended[playlistId];
};

const playlistDeleteRecommended = async (req) => {
	const playlistId = req.params.playlistid;
	const session = req.session;

	if (deleterecommended[playlistId]) {
		return deleterecommended[playlistId];
	}

	const currentPlaylist = await playlistsongs(session, playlistId);
	if (currentPlaylist.error) {
		return currentPlaylist;
	}

	const recentSongs = await MeRecently(session);
	if (recentSongs.error) {
		return recentSongs;
	}
	return subtractById(currentPlaylist, recentSongs);
};

module.exports = { invalidatePlaylist };
