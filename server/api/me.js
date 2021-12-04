const { request, FormatPlaylists } = require("../utils");

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
	return;
};

const meplaylists = async (req, res) => {
	if (!meProfileResult) {
		res.json({ error: true, message: "No user defined" });
		return;
	}
	const offset = 0;
	const response = await request(
		req,
		"https://api.spotify.com/v1/me/playlists?limit=50&offset=" + offset
	);
	if (response.error) {
		res.json(response);
		return;
	}

	res.json(FormatPlaylists(response.items, meProfileResult.id));
	return;
};

module.exports = { me };
