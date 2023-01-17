const addSongToPlaylist = async (playlist, song) => {
	const songData = {
		add_date: Date.now(),
		active: true,
		removed_date: null,
	};
	const currentSong = await playlist.getSongs({ where: { id: song.id } });
	if (currentSong === null) {
		return currentSong.update(songData);
	}
	return playlist.addSong(song, { through: songData });
};

module.exports = { addSongToPlaylist };
