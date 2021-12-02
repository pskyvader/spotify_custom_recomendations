const loggedin = (req, res) => {
    res.json({
		loggedin: req.session.loggedin,
	});
};

module.exports = { loggedin };
