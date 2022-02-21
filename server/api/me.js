const { Op } = require("sequelize");

const { request, formatSongList } = require("../utils");

const { User, Song } = require("../database");

const { updateRecentlyPlayed } = require("./autoupdates");

const me = async (req, res) => {
	let result;
	switch (req.params.submodule) {
		case "playlists":
			result = await mePlaylists(req, res);
			break;
		case "top":
			result = await meTop(req, res);
			break;
		default:
			result = await meProfile(req, res);
			break;
	}
	res.json(result);
};


let mePlaylistResult = {};

const mePlaylists = async (req, res) => {
	if (!meProfileResult[req.session.access_token]) {
		return { error: true, message: "No user defined" };
	}

	if (mePlaylistResult[req.session.access_token]) {
		return mePlaylistResult[req.session.access_token];
	}
	const offset = 0;
	// let playlists = [];
	const response = await request(
		req,
		"https://api.spotify.com/v1/me/playlists?limit=50&offset=" + offset
	);
	if (response.error) {
		console.log(response);
		return response;
	}

	const playlists = response.items;
	// playlists.push(...response.items);

	const MyId = meProfileResult[req.session.access_token].id;

	mePlaylistResult[req.session.access_token] = playlists.map(
		(currentPlaylist) => {
			const formattedPlaylist = {};
			formattedPlaylist.id = currentPlaylist.id;
			formattedPlaylist.disabled = MyId !== currentPlaylist.owner.id;
			formattedPlaylist.selected = false;
			formattedPlaylist.name = currentPlaylist.name;
			formattedPlaylist.image = currentPlaylist.images[0]
				? currentPlaylist.images[0].url
				: null;
			return formattedPlaylist;
		}
	);
	return mePlaylistResult[req.session.access_token];
};

let meTopResult = {};

const meTop = async (req, res) => {
	if (meTopResult[req.session.access_token]) {
		return meTopResult[req.session.access_token];
	}

	let url =
		"https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=long_term";
	let items = [];
	while (url) {
		const response = await request(req, url);
		if (response.error) {
			console.log(response);
			return response;
		}
		url = response.next;
		items.push(...response.items);
	}
	meTopResult[req.session.access_token] = formatSongList(items);
	return meTopResult[req.session.access_token];
};

let meRecentResult = {};

const MeRecently = async (
	req,
	res
) => {
	if (!meProfileResult[req.session.access_token]) {
		return { error: true, message: "No user defined" };
	}
	if (meRecentResult[req.session.access_token]) {
		return meRecentResult[req.session.access_token];
	}

	const iduser = meProfileResult[req.session.access_token].id;

	await updateRecentlyPlayed(req, res, iduser);

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

	meRecentResult[req.session.access_token] = oldRecent.map((currentSong) => {
		return {
			id: currentSong.id,
			name: currentSong.name,
			artist: currentSong.artist,
			idartist: currentSong.idartist,
			album: currentSong.album,
			action: currentSong.action,
		};
	});
	return meRecentResult[req.session.access_token];
};

module.exports = { me,meProfile, meTop, MeRecently };
