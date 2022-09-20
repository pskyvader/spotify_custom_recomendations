const getRepeatedSongs = async (playlist) => {
	const songList = await playlist.getSongs();
	// remove repeated ids from currentPlaylist array
	const filtered = songList.filter((currentSong, index, self) => {
		const found = self.findIndex((song) => {
			return song.id === currentSong.id;
		});
		console.log(
			`Found ${found},index ${index}, id ${currentSong.id}`
		);
		return found !== index;
	});
	const unique = [
		...new Map(filtered.map((song) => [song.id, song])).values(),
	];
	return unique;
};

module.exports = { getRepeatedSongs };
