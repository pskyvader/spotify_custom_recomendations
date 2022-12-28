const { request } = require("../");
const { getAuthorizationObject } = require("./getAuthorizationObject");

const getAuthorizationToken = (access_token, code) => {
	const authObject = getAuthorizationObject(code);
	return request(
		access_token,
		"https://accounts.spotify.com/api/token",
		authObject.method,
		authObject.body,
		authObject.headers
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
