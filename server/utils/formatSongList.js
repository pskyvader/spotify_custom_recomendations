const formatSongList = (songList) => {
	const formattedList = [];
	songList.forEach((song) => {
		const currentSong = song.track || song;

		// console.log("artists", currentSong.artists);
		const art = currentSong.artists.reduce((previous, artist) => {
			previous.push(artist.name);
			return previous;
			// return previous + ", " + artist.name;
		}, []);
		console.log("art", art,art.join(", "));
		const artistid = currentSong.artists[0].id;

		const row = {
			id: currentSong.id,
			name: currentSong.name,
			artist: art.join(", "),
			artistid: artistid,
			album: currentSong.album.name,
			action: currentSong.uri,
		};
		formattedList.push(row);
	});

	return formattedList;
};

module.exports = { formatSongList };
