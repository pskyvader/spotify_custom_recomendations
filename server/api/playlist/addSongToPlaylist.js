const { addSong } = require("../../spotifyapi/playlist");
const addSongToPlaylist = async (access_token, playlist, song) => {
	const response = await addSong(access_token, playlist.id, song.id);
	if (response.error) {
		return response;
	}

	const songData = {
		add_date: Date.now(),
		active: true,
		removed_date: null,
	};
	const currentSong = await playlist.getSongs({ where: { id: song.id } });
	if (currentSong.length === 0) {
		playlist.addSong(song, { through: songData });
		return song;
	}
	currentSong[0].update(songData);
	return song;
};

module.exports = { addSongToPlaylist };
