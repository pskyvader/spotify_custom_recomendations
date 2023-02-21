const { Song } = require("../database");

const createSong = (songData) => {
	return Song.create(songData).catch((err) => {
		return { error: true, message: err.message };
	});
};

const getSong = (songId) => {
	return Song.findByPk(songId).catch((err) => {
		return { error: true, message: err.message };
	});
};

const updateSong = async (
	idsong,
	data = { name: null, artist: null, duration }
) => {
	const currentSong = await Song.findByPk(idsong);
	if (currentSong.error) {
		return currentSong;
	}
	data.last_time_used = Date.now();

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

	const foundplaylist = await currentSong.hasPlaylists();
	const foundusers = await currentSong.hasUsers();
	console.log("foundplaylist: " + foundplaylist, "foundusers: " + foundusers);
	if (foundplaylist !== null || foundusers !== null) {
		return { error: true, message: "Song Still exists" };
	}

	const songDestroyed = await currentSong
		.destroy()
		.catch((err) => ({ error: err.message }));

	if (songDestroyed.error) {
		return songDestroyed;
	}
	return true;
};

module.exports = { createSong, getSong, updateSong, deleteSong };
