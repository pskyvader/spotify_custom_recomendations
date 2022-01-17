const { User } = require("../database/connection");

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
		console.log(response);
		// const access_token = response.access_token || null;
		// const refresh_token = response.refresh_token || null;
		// const expires_in = response.expires_in || null;

		// req.session.loggedin = true;
		// req.session.access_token = access_token;
		// req.session.refresh_token = refresh_token;
		// req.session.expiration = Date.now() + expires_in * 1000;

		res.redirect("/#loggedin=true");
		return;
	}
	res.redirect("/#error=login_error");
};

const logincookie = async (req, res) => {
	let result = { error: null };
	if (
		!req.params.access_token ||
		typeof req.params.access_token === "undefined"
	) {
		result = { error: "No access token available" };
	}
	const currentUser = await User.findOne({
		where: { access_token: req.params.access_token },
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
	console.log(currentUser)

	res.json(result);
};

module.exports = { logincookie };
