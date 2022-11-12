const { Op } = require("sequelize");
const {
	PlaylistSong,
	UserSongHistory,
	Song,
	User,
	Playlist,
} = require("../database");
//week in ms
const week = 604800000;
const deleteGarbage = async () => {
	const destroyedPlaylistSong = await PlaylistSong.destroy({
		where: {
			active: false,
			removed_date: {
				[Op.lte]: Date.now() - 12 * week,
			},
		},
	}).catch((err) => ({ error: true, message: err.message }));
	if (destroyedPlaylistSong.error) {
		return destroyedPlaylistSong;
	}
	const destroyedUserSong = await UserSongHistory.destroy({
		where: {
			played_date: {
				[Op.lte]: Date.now() - 12 * week,
			},
		},
	}).catch((err) => ({ error: true, message: err.message }));
	if (destroyedUserSong.error) {
		return destroyedUserSong;
	}

	const songList = await Song.findAll({
		where: {
			last_time_used: {
				[Op.lte]: Date.now() - 2 * week,
			},
		},
		include: [User, Playlist],
	});

	const removeSongTasks = songList
		.filter(
			(song) => song.Users.length === 0 && song.Playlists.length === 0
		)
		.map((song) =>
			song
				.destroy()
				.catch((err) => ({ error: true, message: err.message }))
		);

	return Promise.all(removeSongTasks).then(
		(success) => {
			return {
				error: false,
				message: [success.length + " removed garbage songs"],
			};
		},
		(error) => {
			return {
				error: true,
				message: ["remove garbage songs error", ...error],
			};
		}
	);
};

module.exports = { deleteGarbage };
