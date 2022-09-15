const { credentials } = require("../../credentials");
const { request } = require("../../utils");

const requestOptions = (refresh_token) => {
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
			grant_type: "refresh_token",
			refresh_token: refresh_token,
		}).toString(),
	};
};

const refreshCookie = async (currentUser) => {
	const refresh_token = currentUser.refresh_token;

	const response = await request(
		currentUser.access_token,
		"https://accounts.spotify.com/api/token",
		"POST",
		null,
		requestOptions(refresh_token)
	);

	if (!response.error) {
		return {
			access_token: response.access_token,
			refresh_token: refresh_token,
			expiration: Date.now() + response.expires_in * 1000,
			hash: currentUser.hash,
		};
	}
	return response;
};

module.exports = { refreshCookie };
