const { getAuthorizationURL } = require("../spotifyapi/user");

const login = (req, res) => {
	const return_value = req.query.return || null;
	const url = getAuthorizationURL();
	if (return_value) {
		res.json({ url });
		return;
	}
	res.redirect(url);
};

module.exports = { login };
