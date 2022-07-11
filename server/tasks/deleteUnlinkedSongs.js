// const { Op } = require("sequelize");
const { User, UserSong, Playlist, Song } = require("../database");
const {
	getPlaylistSongs,
	playlists_cache,
} = require("../api/song/getPlaylistSongs");
//week in ms
const week = 604800000;
const deleteUnlinkedSongs = async () => {
	const allPlaylistSongs = [];
	const users = await User.findAll();
	for (const user of users) {
		const fakesession = {
			hash: user.hash,
			access_token: user.access_token,
			refresh_token: user.refresh_token,
		};
		const userId = user.id;
		const playlists = await Playlist.findAll({
			where: { iduser: userId },
		});
		for (const playlist of playlists) {
			const playlistsongs = await getPlaylistSongs(
				fakesession,
				playlist.id
			);

			allPlaylistSongs.push(playlistsongs);
		}
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
