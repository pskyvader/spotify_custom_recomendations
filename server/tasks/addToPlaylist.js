const { getRecommendedSongs, getSong } = require("../api/song");
const { addSongToPlaylist, getPlaylistSongs } = require("../api/playlist");
const { log, info, warn, error } = require("../utils/logger");

const min = process.env.MIN_SONGS_PER_PLAYLIST;
const max = process.env.MAX_SONGS_PER_PLAYLIST;
const mid = min + Math.floor((max - min) / 2);

const addToSinglePlaylist = async (
	user,
	playlist,
	songsToAdd,
	previouslyRemoved,
	average = null
) => {
	const response = { error: false, addedTotal: 0, playlistId: playlist.id };

	try {
		log("Getting playlist songs", {
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

		let adjustedSongsToAdd = songsToAdd;

		if (playlistSongsList.length < min) {
			adjustedSongsToAdd += 2;
			log("Playlist below minimum, increasing songs to add", {
				userId: user.id,
				playlistId: playlist.id,
				current: playlistSongsList.length,
				min,
			});
		}

		if (playlistSongsList.length < mid) {
			adjustedSongsToAdd += 1;
		}

		if (playlistSongsList.length > max) {
			adjustedSongsToAdd = Math.min(adjustedSongsToAdd, previouslyRemoved);
			adjustedSongsToAdd -= 4;
			warn("Playlist above maximum, limiting songs to add", {
				userId: user.id,
				playlistId: playlist.id,
				current: playlistSongsList.length,
				max,
			});
		}

		if (adjustedSongsToAdd <= 0) {
			warn("Too many songs and no removed songs, skipping addition", {
				userId: user.id,
				playlistId: playlist.id,
				current: playlistSongsList.length,
				max,
			});
			return response;
		}

		log("Getting recommended songs", {
			userId: user.id,
			playlistId: playlist.id,
			songsToAdd: adjustedSongsToAdd,
		});

		const songlist = await getRecommendedSongs(
			user,
			playlist,
			parseInt(playlistSongsList.length / (average || 1))
		);

		if (songlist.error) {
			error("Failed to get recommended songs", {
				userId: user.id,
				playlistId: playlist.id,
			});
			return songlist;
		}

		info("Retrieved recommended songs", {
			userId: user.id,
			playlistId: playlist.id,
			available: songlist.length,
			toAdd: adjustedSongsToAdd,
			current: playlistSongsList.length,
		});

		let i = 0;
		for (const songInList of songlist) {
			if (i >= adjustedSongsToAdd) {
				break;
			}

			const currentSong = await getSong(
				user.access_token,
				songInList.id,
				songInList
			);

			const addSongResponse = await addSongToPlaylist(
				user.access_token,
				playlist,
				currentSong
			);

			if (addSongResponse.error) {
				response.error = true;
				error("Failed to add song to playlist", {
					userId: user.id,
					playlistId: playlist.id,
					songName: currentSong.name,
					error: addSongResponse,
				});
				continue;
			}

			i++;
			log("Song added successfully", {
				userId: user.id,
				playlistId: playlist.id,
				songName: currentSong.name,
			});
		}

		response.addedTotal = i;

		info("addToSinglePlaylist completed", {
			userId: user.id,
			playlistId: playlist.id,
			added: i,
		});

		return response;
	} catch (err) {
		error("addToSinglePlaylist failed", {
			userId: user.id,
			playlistId: playlist.id,
			error: err.message,
		});
		return { error: true, addedTotal: 0 };
	}
};

const addToPlaylist = async (
	user,
	songsToAdd,
	removedTotal = {},
	response = { error: false }
) => {
	try {
		response.addedTotal = {};

		log("Starting addToPlaylist for user", { userId: user.id });

		const playlists = await user.getPlaylists({ where: { active: true } });

		info("Processing playlists", { userId: user.id, count: playlists.length });

		const average = response.average || null;

		for (const playlist of playlists) {
			log("Processing playlist", {
				userId: user.id,
				playlistId: playlist.id,
				playlistName: playlist.name,
			});

			const singleResponse = await addToSinglePlaylist(
				user,
				playlist,
				songsToAdd,
				removedTotal[playlist.id] !== undefined
					? removedTotal[playlist.id]
					: songsToAdd,
				average
			);

			if (singleResponse.error) {
				response.error = singleResponse.error;
			}

			response.addedTotal[playlist.id] = singleResponse.addedTotal;
		}

		info("addToPlaylist completed", {
			userId: user.id,
			totalPlaylists: playlists.length,
		});

		return response;
	} catch (err) {
		error("addToPlaylist failed", { userId: user.id, error: err.message });
		return { error: true, addedTotal: {} };
	}
};

module.exports = { addToPlaylist };
