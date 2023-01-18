const { createSong, getSong } = require("../../model");
const { getSongs } = require("../../spotifyapi/playlist");
const getRepeatedSongs = async (user, playlist) => {
	const songList = await getSongs(user.access_token, playlist);
	// remove repeated ids from currentPlaylist array
	const filtered = songList.filter((currentSong, index, self) => {
		const found = self.findIndex((song) => {
			return song.id === currentSong.id;
		});
		return found !== index;
	});

	const formattedFiltered = await Promise.all(
		filtered.map((song) => {
			const formattedSong = getSong(song.id).then((currentSong) => {
				if (currentSong === null) {
					return createSong(user.access_token, song.id, song);
				}
				return currentSong;
			});
			return formattedSong;
		})
	);

	const unique = [
		...new Map(
			formattedFiltered.map((song) => {
				return [song.id, song];
			})
		).values(),
	];
	return unique;
};

module.exports = { getRepeatedSongs };
