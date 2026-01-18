const { Op } = require("sequelize");
const { Song } = require("../../database");

const getPlaylistSongs = async (
	playlist,
	date = Date.now(),
	syncIfNeeded = false
) => {
	if (!playlist || typeof playlist.getPlaylistSongs !== "function") {
		const message = "getPlaylistSongs: playlist is not a DB-backed object — returning empty list."
		console.warn(message);

		return { error: true, messages: message };
	}

	let playlistSongList = await playlist
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

	if (
		syncIfNeeded &&
		Array.isArray(playlistSongList) &&
		playlistSongList.length === 0
	) {
		console.log(
			"Playlist is empty in DB, attempting to sync from Spotify..."
		);
		try {
			const user = await playlist.getUser();
			if (user) {
				const { syncronizePlaylist } = require("./syncronizePlaylist");
				await syncronizePlaylist(user, playlist);
				// Fetch again, but disable sync this time to avoid potential infinite loops (though syncronizePlaylist passes false too)
				return getPlaylistSongs(playlist, date, false);
			} else {
				console.warn(
					"Could not fetch user for playlist, skipping sync."
				);
			}
		} catch (e) {
			console.error("Error during auto-sync in getPlaylistSongs:", e);
		}
	}

	return playlistSongList;
};

module.exports = { getPlaylistSongs };
