const { request } = require("../../utils");
const { formatSongList, getPlaylist } = require("../../model");

const playlists = {};
let lastGetResult = null;

const addSongPlaylistCache = (playlistId, song) => {
	if (playlists[playlistId]) {
		playlists[playlistId].unshift(song);
	}
};
const removeSongPlaylistCache = (playlistId, song) => {
	if (playlists[playlistId]) {
		const songindex = playlists[playlistId].findIndex(
			(currentSong) => currentSong.id === song.id
		);
		if (songindex !== -1) {
			playlists[playlistId].splice(songindex, 1);
		}
	}
};

const getPlaylistSongs = async (access_token, playlistId, iduser) => {
	if (playlists[playlistId] && lastGetResult > Date.now() - 3600000) {
		return playlists[playlistId];
	}
	const playlistActive = getPlaylist(access_token, playlistId, iduser);
	if (!playlistActive.active) {
		return { error: true, message: "Playlist not active" };
	}

	let url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
	let items = [];
	while (url) {
		const response = await request(access_token, url);
		if (response.error) {
			return response;
		}
		url = response.next;
		items.push(...response.items);
	}

	playlists[playlistId] = formatSongList(items);
	lastGetResult = Date.now();
	return playlists[playlistId];
};

module.exports = {
	getPlaylistSongs,
	addSongPlaylistCache,
	removeSongPlaylistCache,
};
