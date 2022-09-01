const getRepeatedSongs = (playlist) => {
	const songList = await playlist.getSongs();
	// remove repeated ids from currentPlaylist array
	return songList.filter(
		(currentSong, index, self) =>
			self.findIndex((song) => song.id === currentSong.id) !== index
	);
};

module.exports = { getRepeatedSongs };
