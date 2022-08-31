const formatSongAPI = (song) => {
	const art = song.artists.reduce((previous, artist) => {
		previous.push(artist.name);
		return previous;
	}, []);
	const idartist = song.artists[0].id;

	return {
		id: song.id,
		uniqueid: song.uri,
		name: song.name,
		image: song.images[0].url,
		artist: art.join(", "),
		idartist: idartist,
		album: song.album.name,
		duration: song.duration_ms,
	};
};
const formatSongAPIList = (songList) => {
	return songList.map((song) => {
		const currentSong = song.track || song;
		return formatSongAPI(currentSong);
	});
};

const songIdFromURI = (songuri) => {
	const split = songuri.split(":");
	return split.pop();
};

const formatSong = (song) => {
	return {
		id: song.id,
		uniqueid: song.uniqueid,
		name: song.name,
		artist: song.artist,
		idartist: song.idartist,
		album: song.album,
		duration: song.duration,
	};
};

module.exports = { formatSongAPI, formatSongAPIList };
