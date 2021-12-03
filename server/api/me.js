const { request } = require("../utils");
const me =async (req, res) => {
	const response = await request(req,"https://api.spotify.com/v1/me");
	console.log(response)
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

module.exports = { me:me() };
