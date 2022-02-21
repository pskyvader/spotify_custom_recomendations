const { credentials } = require("../../credentials");
const authorizeUser = ({ query }) => {
	const code = query.code || null;
	const state = query.state || null;

	if (code === null) {
		return { error: true, message: "Missing code" };
	}
	if (state === null) {
		return { error: true, message: "Missing state" };
	}

	return {
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
};

module.exports = { authorizeUser };
