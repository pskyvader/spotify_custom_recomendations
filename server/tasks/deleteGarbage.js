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
				[Op.lte]: Date.now() - 2 * week,
			},
		},
	}).catch((err) => ({ error: err.message }));
	if (destroyedPlaylistSong.error) {
		return destroyedPlaylistSong;
	}
	const destroyedUserSong = await UserSongHistory.destroy({
		where: {
			played_date: {
				[Op.lte]: Date.now() - 6 * week,
			},
		},
	}).catch((err) => ({ error: err.message }));
	if (destroyedUserSong.error) {
		return destroyedUserSong;
	}

	const songList = await Song.findAll({
		where: {
			last_time_used: {
				[Op.lte]: Date.now() - 1 * week,
			},
		},
		include: [User, Playlist],
	});

	const removeSongTasks = songList.map((song) => {
		if (song.Users.length === 0 && song.Playlists.length === 0) {
			return song.destroy().catch((err) => ({ error: err.message }));
		}
		return null;
	});
	return Promise.all(removeSongTasks).then(
		(success) => {
			return [success.length + " removed garbage songs"];
		},
		(error) => {
			return [error + "remove garbage songs error"];
		}
	);
};

module.exports = { deleteGarbage };
