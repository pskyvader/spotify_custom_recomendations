const { Op } = require("sequelize");
const { User } = require("../database/connection");
const { credentials } = require("../credentials");
const { request } = require("../utils");

const refreshcookie = async (req, res, currentUser) => {
	const refresh_token = currentUser.refresh_token;
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
		body: new URLSearchParams({
			grant_type: "refresh_token",
			refresh_token: refresh_token,
		}).toString(),
	};
	const response = await request(
		req,
		"https://accounts.spotify.com/api/token",
		"POST",
		null,
		requestOptions
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
		res.json(meProfileResult);
		return;
	}
	res.json({ error: response.error });
};

const logincookie = async (req, res) => {
	let result = { error: null };

	if (!req.cookies.access_token && !req.cookies.refresh_token) {
		result = { error: "No access token available" };
	}
	const currentUser = await User.findOne({
		where: {
			[Op.or]: [
				{ access_token: req.cookies.access_token },
				{ refresh_token: req.cookies.refresh_token },
			],
		},
	});

	if (currentUser !== null) {
		const meProfileResult = {
			access_token: currentUser.access_token,
			refresh_token: currentUser.refresh_token,
			expiration: currentUser.expiration,
		};
		if (Date.now() < meProfileResult.expiration) {
			req.session.loggedin = true;
			req.session.access_token = meProfileResult.access_token;
			req.session.refresh_token = meProfileResult.refresh_token;
			req.session.expiration = meProfileResult.expiration;
			meProfileResult.loggedin = true;
			result = meProfileResult;
			res.json(result);
			return;
		}
		return refreshcookie(req, res, currentUser);
	}

	res.json(result);
};

module.exports = { logincookie };
