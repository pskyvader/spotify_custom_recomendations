const { removeSong } = require("../../spotifyapi/playlist");
const { UserSongHistory } = require("../../database");

const removeSongFromPlaylist = async (access_token, song, playlist) => {
	const response = await removeSong(access_token, playlist.id, song.id);
	if (response.error) {
		return response;
	}

	// Check for nostalgia (listened a lot)
	const playCount = await UserSongHistory.count({
		where: {
			UserId: playlist.UserId,
			SongId: song.id,
		},
	});

	const songData = {
		active: false,
		removed_date: Date.now(),
		nostalgic: playCount >= 5,
	};
	const currentSong = await playlist.getSongs({ where: { id: song.id } });
	if (currentSong.length === 0) {
		await playlist.addSong(song, { through: songData });
		return song;
	}
	await currentSong[0].PlaylistSong.update(songData);
	// return song;
	return currentSong[0];
};

module.exports = { removeSongFromPlaylist };
