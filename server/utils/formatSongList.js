const formatSongList = (songList) => {
	const formattedList = [];
	songList.forEach((song) => {
		const currentSong = song.track || song;
		const art = currentSong.artists.map(
			(artist) => " " + artist.name + " "
		);
		const row = {
			id: currentSong.id,
			name: currentSong.name,
			artist: art,
			album: currentSong.album.name,
			action: currentSong.uri,
		};
		formattedList.push(row);
	});

	return formattedList;
};


module.exports = { formatSongList };