const loggedin = (req, res) => {
	res.json({
		loggedin: req.session
			? req.session.loggedin && req.session.access_token
			: false,
	});
};

module.exports = { loggedin };
