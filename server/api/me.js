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

let meProfileResult = null;

const meProfile = async (req, res) => {
	if (!req.session.access_token) {
		return { error: "Not logged in" };
	}
	if (meProfileResult) {
		return meProfileResult;
	}

	const currentUser = await User.findOne({
		where: {
			[Op.or]: [
				{ access_token: req.session.access_token },
				{ refresh_token: req.session.refresh_token },
			],
		},
	});
	if (currentUser !== null) {
		meProfileResult = {
			id: currentUser.id,
			name: currentUser.name,
			url: currentUser.url,
			image: currentUser.image,
		};
		return meProfileResult;
	}

	const response = await request(req, "https://api.spotify.com/v1/me");
	if (response.error) {
		return response;
	}

	meProfileResult = {
		id: response.id,
		name: response.display_name,
		url: response.external_urls.spotify,
		image: response.images[0].url,
	};

	const [user, created] = await User.findOrCreate({
		where: { id: meProfileResult.id },
		defaults: {
			...meProfileResult,
			access_token: req.session.access_token,
			refresh_token: req.session.refresh_token,
			expiration: req.session.expiration,
		},
	}).catch((err) => {
		console.error(err.message);
		return { error: err.message };
	});
	if (!created) {
		User.update(
			{ ...user },
			{
				where: {
					id: meProfileResult.id,
				},
			}
		);
	}

	return meProfileResult;
};

let mePlaylistResult = null;

const mePlaylists = async (req, res) => {
	if (!meProfileResult) {
		return { error: true, message: "No user defined" };
	}

	if (mePlaylistResult) {
		return mePlaylistResult;
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

	const MyId = meProfileResult.id;

	mePlaylistResult = playlists.map((currentPlaylist) => {
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
	return mePlaylistResult;
};

let meTopResult = null;

const meTop = async (req, res) => {
	if (meTopResult) {
		return meTopResult;
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
	meTopResult = formatSongList(items);
	return meTopResult;
};

let meRecentResult = null;
const MeRecently = async (req, res, after = null, limit = 10) => {
	if (meRecentResult) {
		return meRecentResult;
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
	meRecentResult = formatSongList(items);
	return meRecentResult;
};

module.exports = { me, meTop, MeRecently };
