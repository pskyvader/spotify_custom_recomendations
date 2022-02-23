const { request } = require("../../utils");
const { formatSongList } = require("../../model");

const playlists = {};

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

const getPlaylistSongs = async (access_token, playlistId) => {
	if (playlists[playlistId]) {
		return playlists[playlistId];
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

	return playlists[playlistId];
};

module.exports = { getPlaylistSongs,addSongPlaylistCache,removeSongPlaylistCache };
