const pushtoken = (req, res) => {
	const access_token = req.query.access_token || null;
	const refresh_token = req.query.refresh_token || null;


	req.session.access_token = access_token;
	req.session.refresh_token = refresh_token;

	console.log(req.session.access_token);

	res.json({ loggedin: (access_token && refresh_token) });
};

module.exports = { pushtoken };
