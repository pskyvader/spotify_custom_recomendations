const { request } = require("../../utils");
const { formatSongList } = require("../../model");

const playlists = {};
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

module.exports = { getPlaylistSongs, playlists };
