const pushToken = (req) => {
	const access_token = req.query.access_token || null;
	const refresh_token = req.query.refresh_token || null;
	const expires_in = req.query.expires_in || null;

	req.session.access_token = access_token;
	req.session.refresh_token = refresh_token;
	req.session.expiration = Date.now() + expires_in * 1000;

	req.session.save((err) => {
		return {
			loggedin:
				req.session.access_token !== null &&
				req.session.refresh_token !== null,
		};
	});
	return { error: null };
};

module.exports = { pushToken };
