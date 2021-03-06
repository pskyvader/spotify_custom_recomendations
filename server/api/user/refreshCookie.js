
const { User } = require("../../database");
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

const refreshCookie = async (req, currentUser) => {
	const refresh_token = currentUser.refresh_token;

	const response = await request(
		req.session.access_token,
		"https://accounts.spotify.com/api/token",
		"POST",
		null,
		requestOptions(refresh_token)
	);

	if (!response.error) {
		const meProfileResult = {
			access_token: response.access_token,
			refresh_token: refresh_token,
			expiration: Date.now() + response.expires_in * 1000,
		};
		req.session.loggedin = true;
		req.session.access_token = meProfileResult.access_token;
		req.session.refresh_token = meProfileResult.refresh_token;
		req.session.expiration = meProfileResult.expiration;

		User.update(meProfileResult, {
			where: {
				id: currentUser.id,
			},
		});
		meProfileResult.loggedin = true;
		return meProfileResult;
	}
	return { error: response.error };
};

module.exports = { refreshCookie };
