// const { Op } = require("sequelize");
const { UserSong, Playlist, Song } = require("../database");
const {
	getPlaylistSongs,
	playlists_cache,
} = require("../api/song/getPlaylistSongs");
//week in ms
const week = 604800000;
const deleteUnlinkedSongs = async () => {
	console.log(Object.keys(playlists_cache));
	const allPlaylistSongs = [];
	for (const playlist of Object.keys(playlists_cache)) {
		allPlaylistSongs.push(playlist);
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
	console.log(allPlaylistSongsIds);
	const NeverPlayednotPlaylist = allSongs.filter((song) => {
		return !allPlaylistSongsIds.includes(song.SongId);
	});
	console.log(NeverPlayednotPlaylist.length);
	return "a";
	// return NeverPlayednotPlaylist;
	// console.log(NeverPlayednotPlaylist);
};

module.exports = { deleteUnlinkedSongs };
