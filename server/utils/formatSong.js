const formatSongFeaturesAPI = (songfeatures) => {
	return {
		id: songfeatures.id,
		danceability: songfeatures.danceability,
		energy: songfeatures.energy,
		key: songfeatures.key,
		loudness: songfeatures.loudness,
		mode: songfeatures.mode,
		speechiness: songfeatures.speechiness,
		acousticness: songfeatures.acousticness,
		instrumentalness: songfeatures.instrumentalness,
		liveness: songfeatures.liveness,
		valence: songfeatures.valence,
		tempo: songfeatures.tempo,
		time_signature: songfeatures.time_signature,
	};
};
const formatSongFeaturesAPIList = (songFeaturesList) => {
	return songFeaturesList.map((songFeatures) => {
		return formatSongFeaturesAPI(songFeatures);
	});
};

const formatSongAPI = (song) => {
	const art = song.artists.reduce((previous, artist) => {
		previous.push(artist.name);
		return previous;
	}, []);
	const idartist = song.artists[0].id;

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

module.exports = {
	formatSongAPI,
	formatSongAPIList,
	formatSongFeaturesAPI,
	formatSongFeaturesAPIList,
};
