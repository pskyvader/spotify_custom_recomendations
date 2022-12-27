const { credentials } = require("../../credentials");
const { request } = require("../");

const getAuthorizationToken = (access_token, code) => {
	const headers = {
		"Content-Type": "application/x-www-form-urlencoded",
		Authorization:
			"Basic " +
			Buffer.from(
				credentials.client_id + ":" + credentials.client_secret
			).toString("base64"),
	};
	const body = new URLSearchParams({
		code: code,
		redirect_uri: credentials.redirect_uri,
		grant_type: "authorization_code",
	}).toString();

	return request(
		access_token,
		"https://accounts.spotify.com/api/token",
		"POST",
		body,
		headers
	).then((response) => {
		if (response.error) return response;
		return {
			access_token: response.access_token || null,
			refresh_token: response.refresh_token || null,
			expires_in: response.expires_in || null,
		};
	});
};

module.exports = { getAuthorizationToken };
