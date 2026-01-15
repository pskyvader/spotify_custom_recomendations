const { getAuthorizationURL } = require("../spotifyapi/user");
const { log } = require("../utils/logger");

const login = (req, res) => {
	const return_value = req.query.return || null;
	const url = getAuthorizationURL();
	if (return_value) {
		log("Login returning JSON url", { url });
		res.json({ url });
		return;
	}
	log("Login redirecting to Spotify", { url });
	res.redirect(url);
};

module.exports = { login };
