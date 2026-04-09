const { getRepeatedSongs } = require("../api/song");
const {
	removeSongFromPlaylist,
	addSongToPlaylist,
} = require("../api/playlist");
const { updatePlaylistSong } = require("../model");
const { log, info, error, warn } = require("../utils/logger");

const removeRepeatedFromSinglePlaylist = async (user, playlist) => {
	try {
		log("Fetching repeated songs", {
			userId: user.id,
			playlistId: playlist.id,
		});

		const repeatedList = await getRepeatedSongs(user, playlist);

		info("Found repeated songs", {
			userId: user.id,
			playlistId: playlist.id,
			count: repeatedList.length,
		});

		const repeatedTasks = repeatedList.map((repeatedSong) => {
			const playlistSong = repeatedSong.getPlaylistSongs({
				where: { PlaylistId: playlist.id },
			});
			const removeSong = removeSongFromPlaylist(
				user.access_token,
				repeatedSong,
				playlist
			);
			const addSong = addSongToPlaylist(
				user.access_token,
				playlist,
				repeatedSong
			);

			return playlistSong
				.then((responsePlaylistSongs) => {
					return removeSong.then((response) => {
						if (
							responsePlaylistSongs &&
							responsePlaylistSongs.length > 0
						) {
							response.add_date = responsePlaylistSongs[0].add_date;
						} else {
							response.add_date = Date.now();
						}

						return response;
					});
				})
				.then((responseRemove) => {
					if (responseRemove.error) {
						error("Failed to remove repeated song", {
							userId: user.id,
							playlistId: playlist.id,
							songName: repeatedSong.name,
						});
						return responseRemove;
					}

					return addSong.then((response) => {
						response.add_date = responseRemove.add_date;
						return response;
					});
				})
				.then((responseAdd) => {
					if (responseAdd.error) {
						error("Failed to re-add repeated song", {
							userId: user.id,
							playlistId: playlist.id,
							songName: repeatedSong.name,
						});
						return responseAdd;
					}

					const addData = {
						active: true,
						add_date: responseAdd.add_date,
					};
					return updatePlaylistSong(
						playlist.id,
						repeatedSong.id,
						addData
					);
				})
				.then((finalresponse) => {
					if (finalresponse.error) {
						error("Failed to update playlist song", {
							userId: user.id,
							playlistId: playlist.id,
							songName: repeatedSong.name,
						});
						return finalresponse;
					}

					log("Repeated song refreshed", {
						userId: user.id,
						playlistId: playlist.id,
						songName: repeatedSong.name,
					});

					return finalresponse;
				});
		});

		const results = await Promise.all(repeatedTasks);
		const successCount = results.filter((r) => !r.error).length;

		info("removeRepeatedFromSinglePlaylist completed", {
			userId: user.id,
			playlistId: playlist.id,
			processed: results.length,
			successful: successCount,
		});

		return { removedTotal: successCount };
	} catch (err) {
		error("removeRepeatedFromSinglePlaylist failed", {
			userId: user.id,
			playlistId: playlist.id,
			error: err.message,
		});
		return { removedTotal: 0, error: true };
	}
};

const removeRepeatedSongs = async (user) => {
	try {
		const response = {
			error: false,
			removedTotalRepeated: {},
		};

		log("Starting removeRepeatedSongs for user", { userId: user.id });

		const playlists = await user.getPlaylists({ where: { active: true } });

		info("Processing playlists for repeated songs", {
			userId: user.id,
			count: playlists.length,
		});

		for (const playlist of playlists) {
			log("Processing playlist", {
				userId: user.id,
				playlistId: playlist.id,
				playlistName: playlist.name,
			});

			const singleResponse = await removeRepeatedFromSinglePlaylist(
				user,
				playlist
			);

			if (singleResponse.error) {
				response.error = singleResponse.error;
			}

			response.removedTotalRepeated[playlist.id] =
				singleResponse.removedTotal;
		}

		info("removeRepeatedSongs completed", {
			userId: user.id,
			totalPlaylists: playlists.length,
		});

		return response;
	} catch (err) {
		error("removeRepeatedSongs failed", {
			userId: user.id,
			error: err.message,
		});
		return { error: true, removedTotalRepeated: {} };
	}
};

module.exports = { removeRepeatedSongs };
