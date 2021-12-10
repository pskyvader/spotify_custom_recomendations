const loggedin = (req, res) => {
	res.json({
		loggedin: req.session
			? typeof req.session.access_token === "string"
			: false,
	});
};

module.exports = { loggedin };
