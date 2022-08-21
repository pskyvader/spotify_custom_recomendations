const { Op } = require("sequelize");
const { User, UserSong, Playlist, Song } = require("../database");
const {
	getPlaylistSongs,
	playlists_cache,
} = require("../api/song/getPlaylistSongs");
//week in ms
const week = 604800000;
const deleteUnlinkedSongs = async () => {
	let allPlaylistSongs = [];
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
			if (!playlistsongs.error) {
				allPlaylistSongs = [...allPlaylistSongs, ...playlistsongs];
			}
		}
	}

	const allPlaylistSongsIds = allPlaylistSongs.map((song) => song.id);

	const allSongs = await UserSong.findAll({
		where: {
			[Op.and]: [
				{ removed: false },
				{ song_added: { [Op.lt]: Date.now() - 4 * week } },
				{
					[Op.or]: [
						{ song_last_played: null },
						{
							song_last_played: {
								[Op.lt]: Date.now() - 6 * week,
							},
						},
					],
				},
			],
		},
		include: {
			model: Song,
		},
		raw: true,
		nest: true,
	}).catch((err) => {
		return { error: err.message };
	});
	const NeverPlayednotPlaylist = allSongs.filter((song) => {
		return !allPlaylistSongsIds.includes(song.SongId);
	});

	const destroyIds = NeverPlayednotPlaylist.map((song) => {
		return { id: song.id };
	});
	console.log(
		`destroying unlinked songs: ${NeverPlayednotPlaylist.map((song) => {
			return song.name;
		}).join(", ")}`
	);

	// console.log(NeverPlayednotPlaylist.length, allSongs.length,where,NeverPlayednotPlaylist[0]);
	return UserSong.destroy({
		where: {
			[Op.or]: destroyIds,
		},
		// raw: true,
		// nest: true,
	}).catch((err) => {
		return { error: err.message };
	});
	// return "a";
	// return NeverPlayednotPlaylist;
	// console.log(NeverPlayednotPlaylist);
};

module.exports = { deleteUnlinkedSongs };
