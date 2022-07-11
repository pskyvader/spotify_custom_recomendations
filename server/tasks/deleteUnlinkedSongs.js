const { Op } = require("sequelize");
const { UserSong } = require("../database");
const { getPlaylistSongs } = require("../api/song/getPlaylistSongs");
//week in ms
const week = 604800000;
const deleteUnlinkedSongs = async (session) => {
	const playlists = await Playlist.findAll();
	const allPlaylistSongs = [];
	for (const playlist of playlists) {
		const currentPlaylist = await getPlaylistSongs(session, playlist.id);
		if (currentPlaylist.error) {
			continue;
		}
		allPlaylistSongs.push(currentPlaylist);
	}
	const allPlaylistSongsIds = allPlaylistSongs.map((song) => song.id);

	const allSongs = await UserSong.findAll({
		include: {
			model: Song,
		},
		raw: true,
		nest: true,
	}).catch((err) => {
		return { error: err.message };
	});

	const NeverPlayednotPlaylist = allSongs.filter(
		(song) => !allPlaylistSongsIds.includes(song.id)
	);
	console.log(NeverPlayednotPlaylist);
};

module.exports = { deleteUnlinkedSongs };
