const { generateRandomString } = require("../utils");
const { getAuthorizationToken } = require("../spotifyapi/user");
const { log, error } = require("../utils/logger");

const callback = async (req, res) => {
	const code = req.query.code || null;
	const state = req.query.state || null;

	log("Callback hit", { code: code ? "Exists" : "Missing", state });

	if (state === null) {
		error("Callback: State mismatch. Redirecting to /#error=state_mismatch");
		res.redirect("/#" + new URLSearchParams({ error: "state_mismatch" }));
		return;
	}

	const response = await getAuthorizationToken(
		req.session.access_token,
		code
	);

	if (!response.error) {
		log("Callback: Token retrieved successfully. Redirecting to /#loggedin=true. Hash:", generateRandomString(10));
		req.session.loggedin = true;
		req.session.access_token = response.access_token;
		req.session.refresh_token = response.refresh_token;
		req.session.expiration = Date.now() + response.expires_in * 1000;
		req.session.hash = generateRandomString(10);

		res.redirect("/#loggedin=true");
		return;
	}

	error("Callback: Token retrieval failed", response, "Redirecting to /#error=login_error");
	res.redirect("/#error=login_error");
};

module.exports = { callback };
