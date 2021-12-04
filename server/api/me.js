const { request } = require("../utils");

const me = async (req, res) => {
	switch (req.params[1]) {
		case "playlists":
			meplaylists(req, res);
			break;
		default:
			meprofile(req, res);
			break;
	}
};

const meprofile = async (req, res) => {
	const response = await request(req, "https://api.spotify.com/v1/me");
	if (response.error) {
		res.json(response);
		return;
	}

	const result = {
		name: response.display_name,
		email: response.email,
		url: response.external_urls.spotify,
		image: response.images[0].url,
	};

	res.json(result);
	return;
};

const meplaylists = async (req, res) => {
	const offset = 0;
	const response = await request(
		req,
		"https://api.spotify.com/v1/me/playlists?limit=50&offset=" + offset
	);
	if (response.error) {
		res.json(response);
		return;
	}

	const result = {
		name: response.display_name,
		email: response.email,
		url: response.external_urls.spotify,
		image: response.images[0].url,
	};

	res.json(result);
	return;
};

module.exports = { me };
