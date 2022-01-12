const loggedin = (req, res) => {
	res.json({
		loggedin: req.session
			? typeof req.session.access_token === "string"
			: false,
		access_token: req.session.access_token,
	});
};

module.exports = { loggedin };
