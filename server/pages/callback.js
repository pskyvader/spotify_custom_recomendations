const { credentials } = require("../credentials");
const { request, generateRandomString } = require("../utils");

const callback = async (req, res) => {
	const code = req.query.code || null;
	const state = req.query.state || null;

	if (state === null) {
		res.redirect("/#" + new URLSearchParams({ error: "state_mismatch" }));
		return;
	}

	const requestOptions = {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			Authorization:
				"Basic " +
				Buffer.from(
					credentials.client_id + ":" + credentials.client_secret
				).toString("base64"),
		},
		body: new URLSearchParams({
			code: code,
			redirect_uri: credentials.redirect_uri,
			grant_type: "authorization_code",
		}).toString(),
	};

	const response = await request(
		req.session.access_token,
		"https://accounts.spotify.com/api/token",
		"POST",
		null,
		requestOptions
	);
	if (!response.error) {
		const access_token = response.access_token || null;
		const refresh_token = response.refresh_token || null;
		const expires_in = response.expires_in || null;

		req.session.loggedin = true;
		req.session.access_token = access_token;
		req.session.refresh_token = refresh_token;
		req.session.expiration = Date.now() + expires_in * 1000;
		req.session.hash = generateRandomString(10);

		res.redirect("/#loggedin=true");
		return;
	}

	res.redirect("/#error=login_error");
};

module.exports = { callback };
