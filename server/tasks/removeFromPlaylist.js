const { getRecommendedSongsToRemove } = require("../api/song");
const { removeSongFromPlaylist, getPlaylistSongs } = require("../api/playlist");
const { log, info, warn, error } = require("../utils/logger");

const _MIN_SONGS_PER_PLAYLIST = process.env.MIN_SONGS_PER_PLAYLIST;
const _MAX_SONGS_PER_PLAYLIST = process.env.MAX_SONGS_PER_PLAYLIST;

const removeFromSinglePlaylist = async (
	user,
	playlist,
	songsToRemove,
	average = null
) => {
	const response = { error: false, removedTotal: 0, playlistId: playlist.id };

	try {
		log("Getting playlist songs for removal", {
			userId: user.id,
			playlistId: playlist.id,
			playlistName: playlist.name,
		});

		const playlistSongsList = await getPlaylistSongs(playlist);
		if (playlistSongsList.error) {
			error("Failed to get playlist songs", {
				userId: user.id,
				playlistId: playlist.id,
			});
			return playlistSongsList;
		}

		log("Getting songs to remove", {
			userId: user.id,
			playlistId: playlist.id,
			currentCount: playlistSongsList.length,
		});

		const songlist = await getRecommendedSongsToRemove(
			playlist,
			parseInt(playlistSongsList.length / (average || 1)),
			playlistSongsList.length > _MAX_SONGS_PER_PLAYLIST
		);

		if (songlist.error) {
			error("Failed to get songs to remove", {
				userId: user.id,
				playlistId: playlist.id,
			});
			return songlist;
		}

		let adjustedSongsToRemove = songsToRemove;

		if (playlistSongsList.length < _MIN_SONGS_PER_PLAYLIST) {
			adjustedSongsToRemove -= 2;
			log("Playlist below minimum, reducing removal", {
				userId: user.id,
				playlistId: playlist.id,
				current: playlistSongsList.length,
				limit: _MIN_SONGS_PER_PLAYLIST,
			});
		}

		if (playlistSongsList.length > _MAX_SONGS_PER_PLAYLIST) {
			adjustedSongsToRemove += 2;
			warn("Playlist above maximum, increasing removal", {
				userId: user.id,
				playlistId: playlist.id,
				current: playlistSongsList.length,
				limit: _MAX_SONGS_PER_PLAYLIST,
			});
		}

		info("Starting song removal", {
			userId: user.id,
			playlistId: playlist.id,
			available: songlist.length,
			toRemove: Math.min(adjustedSongsToRemove, songlist.length),
		});

		let i = 0;
		for (const songInList of songlist) {
			if (i >= adjustedSongsToRemove) {
				break;
			}

			const removeResponse = await removeSongFromPlaylist(
				user.access_token,
				songInList,
				playlist
			);

			if (removeResponse.error) {
				error("Failed to remove song from playlist", {
					userId: user.id,
					playlistId: playlist.id,
					songName: songInList.name,
					error: removeResponse,
				});
				continue;
			}

			response.removedTotal += 1;
			i++;

			log("Song removed successfully", {
				userId: user.id,
				playlistId: playlist.id,
				songName: songInList.name,
				removedCount: i,
			});
		}

		info("removeFromSinglePlaylist completed", {
			userId: user.id,
			playlistId: playlist.id,
			removed: response.removedTotal,
		});

		return response;
	} catch (err) {
		error("removeFromSinglePlaylist failed", {
			userId: user.id,
			playlistId: playlist.id,
			error: err.message,
		});
		return { error: true, removedTotal: 0 };
	}
};

const removeFromPlaylist = async (
	user,
	songsToRemove,
	response = { error: false }
) => {
	try {
		response.removedTotal = {};

		log("Starting removeFromPlaylist for user", { userId: user.id });

		const playlists = await user.getPlaylists({ where: { active: true } });

		info("Processing playlists for removal", {
			userId: user.id,
			count: playlists.length,
		});

		const average = response.average || null;

		for (const playlist of playlists) {
			log("Processing playlist for removal", {
				userId: user.id,
				playlistId: playlist.id,
				playlistName: playlist.name,
			});

			const singleResponse = await removeFromSinglePlaylist(
				user,
				playlist,
				songsToRemove,
				average
			);

			if (singleResponse.error) {
				response.error = singleResponse.error;
			}

			response.removedTotal[playlist.id] = singleResponse.removedTotal;
		}

		info("removeFromPlaylist completed", {
			userId: user.id,
			totalPlaylists: playlists.length,
		});

		return response;
	} catch (err) {
		error("removeFromPlaylist failed", { userId: user.id, error: err.message });
		return { error: true, removedTotal: {} };
	}
};

module.exports = { removeFromPlaylist };
