const { request, formatSongList } = require("../utils");

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
	if (meProfileResult) {
		return meProfileResult;
	}
	const response = await request(req, "https://api.spotify.com/v1/me");
	if (response.error) {
		return response;
	}

	meProfileResult = {
		id: response.id,
		name: response.display_name,
		email: response.email,
		url: response.external_urls.spotify,
		image: response.images[0].url,
	};

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
	let offset = 0;

	const url =
		"https://api.spotify.com/v1/me/top/tracks?limit=50&offset=" +
		offset +
		"&time_range=long_term";
	const response = await request(req, url);
	if (response.error) {
		return response;
	}
	meTopResult = formatSongList(response.items);
	return meTopResult;
};

let meRecentResult = {};
const MeRecently = async (req,res,after = null, limit = 10) => {
	if (meRecentResult !== null) {
		return meRecentResult;
	}

	if (after === null) {
		after = Date.now() - 604800000; //1 week in milliseconds = (24*60*60*1000) * 7; //7 days)
	}
	
	let recent={cursors:{}};
	while (recent.cursors) {
		const url =
			"https://api.spotify.com/v1/me/player/recently-played?limit=" +
			limit +
			"&after=" +
			after;

		recent = await request(req, url);
		if (recent.error) {
			return recent;
		}
		meRecentResult.push(...(formatSongList(recent.items)));
		if (recent.cursors) {
			after=recent.cursors.after;
		}
	}
	return meRecentResult;
};

module.exports = { me, meTop,MeRecently };
