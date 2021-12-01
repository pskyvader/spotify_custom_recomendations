const { credentials } = require("../credentials");
const authorize = (req, res) => {
	const code = req.query.code || null;
	const state = req.query.state || null;

	if (code === null) {
		res.json({ error: true, message: "Missing code" });
		return;
	}
	if (state === null) {
		res.json({ error: true, message: "Missing state" });
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
		body: {
			code: code,
			redirect_uri: credentials.redirect_uri,
			grant_type: "authorization_code",
		},
	};

	res.json(requestOptions);
};

module.exports = { authorize };
