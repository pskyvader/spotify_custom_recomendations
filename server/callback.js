const request = require("request");
const { credentials } = require("./credentials");
const callback = (req, res) => {
	var code = req.query.code || null;
	var state = req.query.state || null;
	const return_value = req.query.return || null;

	if (state === null) {
		res.redirect("/#" + new URLSearchParams({ error: "state_mismatch" }));
		return;
	}

	var authOptions = {
		url: "https://accounts.spotify.com/api/token",
		form: {
			code: code,
			// redirect_uri: credentials.redirect_uri,
			redirect_uri: "http://localhost:5000/callback",
			grant_type: "authorization_code",
		},
		headers: {
			Authorization:
				"Basic " +
				Buffer.from(
					credentials.client_id + ":" + credentials.client_secret
				).toString("base64"),
		},
		json: true,
	};

	if (return_value) {
		res.json(authOptions);
		return;
	}

	request.post(authOptions, function (error, response, body) {
		if (!error && response.statusCode === 200) {
			const access_token = body.access_token;
			const refresh_token = body.refresh_token;

			req.session.loggedin = true;
			req.session.access_token = access_token;
			req.session.refresh_token = refresh_token;

			const response_value = { loggedin: true };

			res.redirect("/#" + new URLSearchParams(response_value));
			return;
		}
		res.json({ error: true, message: response });
	});
};

module.exports = { callback };
