const { getPlaylistSongsFromAPI } = require("./getPlaylistSongsFromAPI");
const { getSong } = require("../../model");
const getRepeatedSongs = async (user, playlist) => {
	const songList = await getPlaylistSongsFromAPI(user, playlist);
	// remove repeated ids from currentPlaylist array
	const filtered = songList.filter((currentSong, index, self) => {
		const found = self.findIndex((song) => {
			return song.id === currentSong.id;
		});
		return found !== index;
	});

	const formattedFiltered = await Promise.all(
		filtered.map((song) => {
			const formattedSong = getSong(user.access_token, song.id, song);
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
