const getRepeatedSongs = async (playlist) => {
	const songList = await playlist.getSongs();
	// remove repeated ids from currentPlaylist array
	const filtered = songList.filter(
		(currentSong, index, self) =>
			self.findIndex((song) => song.id === currentSong.id) !== index
	);
	const unique = [
		...new Map(filtered.map((song) => [song.id, song])).values(),
	];
	return unique;
};

module.exports = { getRepeatedSongs };
