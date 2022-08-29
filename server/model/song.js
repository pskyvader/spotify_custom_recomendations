const { Song } = require("../database");
const { request, formatSongAPI } = require("../utils");

const createSong = async (access_token, songId) => {
	let url = `https://api.spotify.com/v1/tracks/${songId}`;
	const response = await request(access_token, url);
	if (response.error) {
		return response;
	}
	const data = formatSongAPI(response);
	const [newSong] = await Song.upsert(data).catch((err) => {
		console.error("create song error", err);
		return { error: err.message };
	});

	return newSong;
};

const getSong = async (access_token, songId) => {
	const currentSong = await Song.findByPk(songId);
	if (currentSong !== null) {
		return currentSong;
	}
	return createSong(access_token, songId);
};

const updateSong = async (
	access_token,
	idsong,
	data = { name: null, artist: null, duration }
) => {
	const currentSong = await getSong(access_token, idsong);
	if (currentSong.error) {
		return currentSong;
	}

	currentSong.set(data);
	const songSaved = await currentSong
		.save()
		.catch((err) => ({ error: err.message }));
	if (songSaved.error) {
		return songSaved;
	}
	return currentSong;
};

const deleteSong = async () => {
	return null;
};

module.exports = { getSong, updateSong, deleteSong };
