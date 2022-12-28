const { request } = require("../request");
const { getAuthorizationObject } = require("./getAuthorizationObject");

const refreshCookie = (currentUser) => {
	const refresh_token = currentUser.refresh_token;
	const authObject = getAuthorizationObject();

	const body = new URLSearchParams({
		grant_type: "refresh_token",
		refresh_token: refresh_token,
	}).toString();

	return request(
		currentUser.access_token,
		"https://accounts.spotify.com/api/token",
		authObject.method,
		body,
		authObject.headers
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
