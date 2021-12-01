const pushtoken = (req, res) => {
	const access_token = req.query.access_token || null;
	const refresh_token = req.query.refresh_token || null;

	req.session.loggedin = true;
	req.session.access_token = access_token;
	req.session.refresh_token = refresh_token;

	res.json({ loggedin: true });

	// res.json({ error: true, message: response });
};

module.exports = { pushtoken };
