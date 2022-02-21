const getPlaylistsongs = async (playlists, session, playlistId) => {
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

module.exports = { getPlaylistsongs };
