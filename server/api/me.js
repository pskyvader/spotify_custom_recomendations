const { request } = require("../utils");

const me = (req, res) => {
	switch (req.params.submodule) {
		case "playlists":
			meplaylists(req, res);
			break;
		default:
			meprofile(req, res);
			break;
	}
};

let meProfileResult = null;

const meprofile = async (req, res) => {
	if (meProfileResult) {
		res.json(meProfileResult);
		return;
	}
	const response = await request(req, "https://api.spotify.com/v1/me");
	if (response.error) {
		res.json(response);
		return;
	}

	meProfileResult = {
		id: response.id,
		name: response.display_name,
		email: response.email,
		url: response.external_urls.spotify,
		image: response.images[0].url,
	};

	res.json(meProfileResult);
};

let mePlaylistResult = null;

const meplaylists = async (req, res) => {
	if (!meProfileResult) {
		res.json({ error: true, message: "No user defined" });
		return;
	}

	if (mePlaylistResult && !req.query.force) {
		res.json(mePlaylistResult);
		return;
	}

	const offset = 0;
	const response = await request( req, "https://api.spotify.com/v1/me/playlists?limit=50&offset=" + offset );
	if (response.error) {
		res.json(response);
		return;
	}

	let itemList = playlists.map((currentPlaylist) =>{
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
	mePlaylistResult=itemList;

	res.json(itemList);
};

module.exports = { me };
