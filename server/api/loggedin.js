const loggedin = (req, res) => {
	let isLoggedIn = false;
	if (
		req.session &&
		typeof req.session.access_token === "string" &&
		Date.now() < req.session.expiration
	) {
		isLoggedIn = true;
	}

	res.json({ loggedin: isLoggedIn, access_token: req.session.access_token });
};

module.exports = { loggedin };
