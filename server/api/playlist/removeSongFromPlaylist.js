const { removeSong } = require("../../spotifyapi/playlist");

const removeSongFromPlaylist = async (user, song, playlist) => {
	const response = await removeSong(user.access_token, playlist.id, song.id);
	if (response.error) {
		return response;
	}
	const songData = {
		active: false,
		removed_date: Date.now(),
	};
	const currentSong = await playlist.getSongs({ where: { id: song.id } });
	if (currentSong.length === 0) {
		await playlist.addSong(song, { through: songData });
		return song;
	}
	await currentSong[0].update(songData);
	return song;
};

module.exports = { removeSongFromPlaylist };
