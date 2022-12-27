const { credentials } = require("../credentials");
const { generateRandomString } = require("../utils");
const { getAuthorizationToken } = require("../spotifyapi/user");

const callback = async (req, res) => {
	const code = req.query.code || null;
	const state = req.query.state || null;

	if (state === null) {
		res.redirect("/#" + new URLSearchParams({ error: "state_mismatch" }));
		return;
	}

	const response = await getAuthorizationToken(
		req.session.access_token,
		code
	);

	if (!response.error) {
		req.session.loggedin = true;
		req.session.access_token = response.access_token;
		req.session.refresh_token = response.refresh_token;
		req.session.expiration = Date.now() + response.expires_in * 1000;
		req.session.hash = generateRandomString(10);

		res.redirect("/#loggedin=true");
		return;
	}

	res.redirect("/#error=login_error");
};

module.exports = { callback };
