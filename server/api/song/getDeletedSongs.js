const { Song } = require("../../database");
const getDeletedSongs = async (playlist) => {
	return playlist
		.getPlaylistSongs({
			where: {
				active: false,
			},
			include: [
				{
					model: Song,
				},
			],
			order: [["removed_date", "DESC"]],
		})
		.then((playlistSongList) => {
			return playlistSongList.map((playlistSong) => {
				const song = playlistSong.Song;
				song.PlaylistSong = playlistSong;
				return song;
			});
		})
		.catch((err) => {
			console.error("getDeletedSongs error", err);
			return { error: true, messages: err.message };
		});
};

module.exports = { getDeletedSongs };
