const { request } = require("../../utils");
const {
	getUser,
	formatSongList,
	playlistStatus,
	getSong,
} = require("../../model");

const playlists = {};
let lastGetResult = null;

const addSongPlaylistCache = (playlistId, song) => {
	if (playlists[playlistId]) {
		playlists[playlistId].unshift(song);
	}
};
const removeSongPlaylistCache = (playlistId, song) => {
	if (playlists[playlistId]) {
		const songindex = playlists[playlistId].findIndex(
			(currentSong) => currentSong.id === song.id
		);
		if (songindex !== -1) {
			playlists[playlistId].splice(songindex, 1);
		}
	}
};

const getPlaylistSongs = async (session, playlistId, syncSongs = false) => {
	const currentUser = await getUser(session);
	if (currentUser.error) {
		return currentUser;
	}
	if (
		playlists[playlistId] &&
		lastGetResult > Date.now() - 3600000 &&
		!syncSongs
	) {
		return playlists[playlistId];
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

	playlists[playlistId] = formatSongList(items);

	if (syncSongs) {
		let i = 0;
		for (const song of playlists[playlistId]) {
			if (i % 10 === 0) {
				console.log(
					`getting song ${song.id} (${i}/${playlists[playlistId].length})`
				);
			}
			await getSong(session.access_token, song.id, currentUser.id);
			i++;
		}
	}

	lastGetResult = Date.now();
	return playlists[playlistId];
};

module.exports = {
	getPlaylistSongs,
	addSongPlaylistCache,
	removeSongPlaylistCache,
};
