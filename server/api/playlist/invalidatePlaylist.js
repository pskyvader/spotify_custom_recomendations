const invalidatePlaylist = (
	playlists,
	recommended,
	deleterecommended,
	playlistId,
	songUri
) => {
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

module.exports = { invalidatePlaylist };
