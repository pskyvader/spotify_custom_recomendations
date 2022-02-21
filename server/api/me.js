const { Op } = require("sequelize");

const { request } = require("../utils");
const { getUser, formatSongList } = require("../model");
let mePlaylistResult = {};

const mePlaylists = async (req) => {
	const session = req.session;
	const currentUser = getUser(session);
	if (currentUser.error) {
		return currentUser;
	}

	if (mePlaylistResult[session.access_token]) {
		return mePlaylistResult[session.access_token];
	}
	let url = "https://api.spotify.com/v1/me/playlists?limit=50";

	let playlists = [];
	while (url) {
		const response = await request(session, url);
		if (response.error) {
			console.log(response);
			return response;
		}
		url = response.next;
		playlists.push(...response.items);
	}

	mePlaylistResult[session.access_token] = playlists.map(
		(currentPlaylist) => {
			const formattedPlaylist = {};
			formattedPlaylist.id = currentPlaylist.id;
			formattedPlaylist.disabled =
				currentUser.id !== currentPlaylist.owner.id;
			formattedPlaylist.selected = false;
			formattedPlaylist.name = currentPlaylist.name;
			formattedPlaylist.image = currentPlaylist.images[0]
				? currentPlaylist.images[0].url
				: null;
			return formattedPlaylist;
		}
	);
	return mePlaylistResult[session.access_token];
};

let meTopResult = {};

const meTop = async (session) => {
	const currentUser = getUser(session);
	if (currentUser.error) {
		return currentUser;
	}
	const access_token = session.access_token;

	if (meTopResult[access_token]) {
		return meTopResult[access_token];
	}

	let url =
		"https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=long_term";
	let items = [];
	while (url) {
		const response = await request(session, url);
		if (response.error) {
			console.log(response);
			return response;
		}
		url = response.next;
		items.push(...response.items);
	}
	meTopResult[access_token] = formatSongList(items);
	return meTopResult[access_token];
};

let meRecentResult = {};

const MeRecently = async (session) => {
	const currentUser = getUser(session);
	if (currentUser.error) {
		return currentUser;
	}
	const access_token = session.access_token;

	if (meRecentResult[access_token]) {
		return meRecentResult[access_token];
	}

	const iduser = currentUser.id;

	await updateRecentlyPlayed(session, iduser);

	const oldRecent = await Song.findAll({
		where: {
			[Op.and]: [{ iduser: iduser }, { removed: false }],
		},
		order: [["song_added", "ASC"]],
		raw: true,
		nest: true,
	}).catch((err) => {
		return { error: err.message };
	});

	meRecentResult[access_token] = oldRecent.map((currentSong) =>
		formatSong(currentSong)
	);
	return meRecentResult[access_token];
};

module.exports = { mePlaylists, meTop, MeRecently };
