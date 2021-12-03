const { request } = require("../utils");
const me = (req, res) => {
	const response = await request(req,"https://accounts.spotify.com/api/me");
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
};

module.exports = { me };
