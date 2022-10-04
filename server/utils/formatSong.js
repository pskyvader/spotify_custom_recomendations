const formatSongAPI = (song) => {
	const art = song.artists.reduce((previous, artist) => {
		previous.push(artist.name);
		return previous;
	}, []);
	const idartist = song.artists[0].id;

	if (song.preview_url === null) {
		console.log("No preview available in format song api", song);
	}

	return {
		id: song.id,
		name: song.name,
		image: song.album.images[0].url,
		artist: art.join(", "),
		idartist: idartist,
		album: song.album.name,
		duration: song.duration_ms,
		preview: song.preview_url,
	};
};
const formatSongAPIList = (songList) => {
	return songList.map((song) => {
		const currentSong = song.track || song;
		return formatSongAPI(currentSong);
	});
};
module.exports = { formatSongAPI, formatSongAPIList };
