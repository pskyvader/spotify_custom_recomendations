const { Song, PlaylistSong } = require("../database");
const { request, formatSongAPI } = require("../utils");

const createSong = async (access_token, songId, data = null) => {
	if (data === null) {
		let url = `https://api.spotify.com/v1/tracks/${songId}`;
		const response = await request(access_token, url);
		if (response.error) {
			return response;
		}
		data = formatSongAPI(response);
	}

	const [newSong] = await Song.upsert(data).catch((err) => {
		console.error("create song error", err);
		return { error: err.message };
	});

	return newSong;
};

const getSong = async (access_token, songId, data = null) => {
	const currentSong = await Song.findByPk(songId);
	if (currentSong !== null) {
		return currentSong;
	}
	return createSong(access_token, songId, data);
};

const updateSong = async (
	idsong,
	data = { name: null, artist: null, duration }
) => {
	const currentSong = await Song.findByPk(idsong);
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

const deleteSong = async (idsong) => {
	const currentSong = await Song.findByPk(idsong);
	if (currentSong === null) {
		return true;
	}
	const playlistSongsDestroyed = await PlaylistSong.destroy({
		where: { SongId: idsong },
	}).catch((err) => ({
		error: err.message,
	}));
	if (playlistSongsDestroyed.error) {
		return playlistSongsDestroyed;
	}

	const songDestroyed = await currentPlaylist
		.destroy()
		.catch((err) => ({ error: err.message }));

	if (songDestroyed.error) {
		return songDestroyed;
	}
	return true;
};

module.exports = { getSong, updateSong, deleteSong };
