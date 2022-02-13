const formatSongList = (songList) => {
	const formattedList = [];
	songList.forEach((song) => {
		const currentSong = song.track || song;
		const art = currentSong.artists.reduce((previous, artist) => {
			previous.push(artist.name);
			return previous;
		}, []);
		const idartist = currentSong.artists[0].id;

		const row = {
			id: currentSong.id,
			name: currentSong.name,
			artist: art.join(", "),
			idartist: idartist,
			album: currentSong.album.name,
			action: currentSong.uri,
		};
		formattedList.push(row);
	});

	return formattedList;
};

module.exports = { formatSongList };
