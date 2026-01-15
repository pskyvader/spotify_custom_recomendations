const formatSong = (rawData) => {
	const art = rawData.artists.reduce((previous, artist) => {
		previous.push(artist.name);
		return previous;
	}, []);
	const idartist = rawData.artists[0].id;

	return {
		id: rawData.id,
		name: rawData.name,
		image:
			(rawData.album.images &&
				rawData.album.images[0] &&
				rawData.album.images[0].url) ||
			null,
		artist: art.join(", "),
		idartist: idartist,
		album: rawData.album.name,
		duration: rawData.duration_ms,
		preview: rawData.preview_url,
	};
};

const formatSongGroup = (rawGroup) => {
	return rawGroup.map((currentSong) => {
		return formatSong(currentSong);
	});
};

module.exports = { formatSong, formatSongGroup };
