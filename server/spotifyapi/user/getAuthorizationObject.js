const { credentials } = require("../../credentials");
const getAuthorizationObject = (code = null) => {
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

module.exports = { getAuthorizationObject };
