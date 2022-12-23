const { createPlaylistSong } = require("../../model");

const addSongToPlaylist = async (playlist, song) => {
	const addedSong = await createPlaylistSong(playlist, song);
	return addedSong;
};

module.exports = { addSongToPlaylist };
