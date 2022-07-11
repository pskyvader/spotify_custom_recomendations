const { request } = require("../../utils");
const {
	getUser,
	formatSongList,
	playlistStatus,
	getSong,
} = require("../../model");
const { Song } = require("../../database");

const playlists_cache = {};
let lastGetResult = null;

const addSongPlaylistCache = (playlistId, song) => {
	if (playlists_cache[playlistId]) {
		playlists_cache[playlistId].unshift(song);
	}
};
const removeSongPlaylistCache = (playlistId, song) => {
	if (playlists_cache[playlistId]) {
		const songindex = playlists_cache[playlistId].findIndex(
			(currentSong) => currentSong.id === song.id
		);
		if (songindex !== -1) {
			playlists_cache[playlistId].splice(songindex, 1);
		}
	}
};

const getPlaylistSongs = async (session, playlistId, syncSongs = false) => {
	const currentUser = await getUser(session);
	if (currentUser.error) {
		return currentUser;
	}
	if (
		playlists_cache[playlistId] &&
		lastGetResult > Date.now() - 3600000 &&
		!syncSongs
	) {
		console.log(`Using cache for playlist ${playlistId}`);
		return playlists_cache[playlistId];
	}
	const playlistActive = await playlistStatus(session, playlistId);
	if (!playlistActive.active) {
		return { error: true, message: "Playlist not active" };
	}

	let url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
	let items = [];
	while (url) {
		const response = await request(session.access_token, url);
		if (response.error) {
			return response;
		}
		url = response.next;
		items.push(...response.items);
	}

	playlists_cache[playlistId] = formatSongList(items);

	if (syncSongs) {
		const allsongs = await Song.findAll({ attributes: ["id"] });
		const allsongsIds = allsongs.map((song) => song.id);
		const songsToAdd = playlists_cache[playlistId].filter(
			(song) => !allsongsIds.includes(song.id)
		);
		console.log("Songs to add to cache", songsToAdd.length);

		let i = 0;
		for (const song of songsToAdd) {
			if (i % 10 === 0) {
				console.log(
					`adding song ${song.id} (${i}/${songsToAdd.length}) to cache`
				);
			}
			await getSong(session.access_token, song.id, currentUser.id);
			i++;
		}
		console.log("Done adding songs to cache");
	}

	lastGetResult = Date.now();
	return playlists_cache[playlistId];
};

module.exports = {
	getPlaylistSongs,
	addSongPlaylistCache,
	removeSongPlaylistCache,
	playlists_cache
};
