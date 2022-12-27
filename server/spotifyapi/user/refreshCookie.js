const { credentials } = require("../../credentials");
const { request } = require("../request");

const refreshCookie = (currentUser) => {
	const refresh_token = currentUser.refresh_token;

	const body = new URLSearchParams({
		grant_type: "refresh_token",
		refresh_token: refresh_token,
	}).toString();

	const headers = {
		"Content-Type": "application/x-www-form-urlencoded",
		Authorization:
			"Basic " +
			Buffer.from(
				credentials.client_id + ":" + credentials.client_secret
			).toString("base64"),
	};

	return request(
		currentUser.access_token,
		"https://accounts.spotify.com/api/token",
		"POST",
		body,
		headers
	).then((response) => {
		if (response.error) {
			return response;
		}
		return {
			access_token: response.access_token,
			refresh_token: refresh_token,
			expiration: Date.now() + response.expires_in * 1000,
			hash: currentUser.hash,
		};
	});
};

module.exports = { refreshCookie };
