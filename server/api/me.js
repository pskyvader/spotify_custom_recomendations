const { Op } = require("sequelize");

const { request, formatSongList } = require("../utils");
const { User } = require("../database/connection");

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

let meProfileResult = {};

const meProfile = async (req, res) => {
	if (!req.session.access_token) {
		return { error: "Not logged in" };
	}
	if (meProfileResult[req.session.access_token]) {
		return meProfileResult[req.session.access_token];
	}

	const currentUser = await User.findOne({
		where: {
			access_token: req.session.access_token,
		},
	});
	if (currentUser !== null) {
		meProfileResult[req.session.access_token] = {
			id: currentUser.id,
			name: currentUser.name,
			url: currentUser.url,
			image: currentUser.image,
			access_token: req.session.access_token,
			refresh_token: req.session.refresh_token,
		};
		return meProfileResult[req.session.access_token];
	}

	const response = await request(req, "https://api.spotify.com/v1/me");
	if (response.error) {
		return response;
	}

	meProfileResult[req.session.access_token] = {
		id: response.id,
		name: response.display_name,
		url: response.external_urls.spotify,
		image: response.images[0].url,
		access_token: req.session.access_token,
		refresh_token: req.session.refresh_token,
	};

	const defaultValues = {
		...meProfileResult[req.session.access_token],
		expiration: req.session.expiration,
	}

	const [user, created] = await User.findOrCreate({
		where: { id: meProfileResult[req.session.access_token].id },
		defaults: defaultValues,
	}).catch((err) => {
		return { error: err.message };
	});
	if (!created) {
		User.update(defaultValues, {
			where: {
				id: meProfileResult[req.session.access_token].id,
			},
		});
	}

	return meProfileResult[req.session.access_token];
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
	let playlists = [];
	const response = await request(
		req,
		"https://api.spotify.com/v1/me/playlists?limit=50&offset=" + offset
	);
	if (response.error) {
		return response;
	}
	playlists.push(...response.items);

	const MyId = meProfileResult[req.session.access_token].id;

	mePlaylistResult[req.session.access_token] = playlists.map((currentPlaylist) => {
		const formattedPlaylist = {};
		formattedPlaylist.id = currentPlaylist.id;
		formattedPlaylist.disabled = MyId !== currentPlaylist.owner.id;
		formattedPlaylist.selected = false;
		formattedPlaylist.name = currentPlaylist.name;
		formattedPlaylist.image = currentPlaylist.images[0]
			? currentPlaylist.images[0].url
			: null;
		return formattedPlaylist;
	});
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
			return response;
		}
		url = response.next;
		items.push(...response.items);
	}
	meTopResult[req.session.access_token] = formatSongList(items);
	return meTopResult[req.session.access_token];
};

let meRecentResult = {};
const MeRecently = async (req, res, after = null, limit = 10) => {
	if (meRecentResult[req.session.access_token]) {
		return meRecentResult[req.session.access_token];
	}

	if (after === null) {
		after = Date.now() - 604800000; //1 week in milliseconds = (24*60*60*1000) * 7; //7 days)
	}

	let url =
		"https://api.spotify.com/v1/me/player/recently-played?limit=" +
		limit +
		"&after=" +
		after;
	let items = [];
	while (url) {
		const response = await request(req, url);
		if (response.error) {
			return response;
		}
		url = response.next;
		items.push(...response.items);
	}
	meRecentResult[req.session.access_token] = formatSongList(items);
	return meRecentResult[req.session.access_token];
};

module.exports = { me, meTop, MeRecently };
