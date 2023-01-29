const { Op } = require("sequelize");
const { Song } = require("../../database");
const getPlaylistSongs = async (playlist, date = Date.now()) => {
	return playlist
		.getPlaylistSongs({
			where: {
				active: true,
				add_date: { [Op.lte]: date },
			},
			include: [Song],
			order: [["add_date", "DESC"]],
		})
		.then((playlistSongList) => {
			return playlistSongList.map((playlistSong) => {
				const song = playlistSong.Song;
				song.PlaylistSong = playlistSong;
				return song;
			});
		})
		.catch((err) => {
			console.error("getPlaylistSongs error", err);
			return { error: true, messages: err.message };
		});
};

module.exports = { getPlaylistSongs };
