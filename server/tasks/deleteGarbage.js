const { Op } = require("sequelize");
const {
	PlaylistSong,
	UserSongHistory,
	Song,
	User,
	Playlist,
} = require("../database");
const { log, info, error } = require("../utils/logger");

//week in ms
const week = 604800000;
const deleteGarbage = async () => {
	try {
		log("Starting deleteGarbage task");

		const destroyedPlaylistSong = await PlaylistSong.destroy({
			where: {
				active: false,
				removed_date: {
					[Op.lte]: Date.now() - 12 * week,
				},
			},
		}).catch((err) => {
			error("Failed to destroy old playlist songs", { error: err.message });
			throw err;
		});

		info("Destroyed old playlist songs", { count: destroyedPlaylistSong });

		const destroyedUserSong = await UserSongHistory.destroy({
			where: {
				played_date: {
					[Op.lte]: Date.now() - 12 * week,
				},
			},
		}).catch((err) => {
			error("Failed to destroy old user song history", { error: err.message });
			throw err;
		});

		info("Destroyed old user song history", { count: destroyedUserSong });

		const songList = await Song.findAll({
			include: [User, Playlist],
		});

		log("Checking for unused songs", { totalSongs: songList.length });

		const unusedSongs = songList.filter(
			(song) => song.Users.length === 0 && song.Playlists.length === 0
		);

		info("Found unused songs to remove", { count: unusedSongs.length });

		const removeSongTasks = unusedSongs.map((song) =>
			song
				.destroy()
				.catch((err) => {
					error("Failed to destroy song", { songId: song.id, error: err.message });
					throw err;
				})
		);

		await Promise.all(removeSongTasks);

		info("deleteGarbage task completed successfully", {
			playlistSongsDeleted: destroyedPlaylistSong,
			userSongsDeleted: destroyedUserSong,
			garbageSongsDeleted: unusedSongs.length,
		});

		return {
			error: false,
			playlistSongsDeleted: destroyedPlaylistSong,
			userSongsDeleted: destroyedUserSong,
			garbageSongsDeleted: unusedSongs.length,
		};
	} catch (err) {
		error("deleteGarbage task failed", { error: err.message });
		return {
			error: true,
		};
	}
};

module.exports = { deleteGarbage };
