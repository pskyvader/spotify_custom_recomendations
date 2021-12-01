const loggedin = (req, res) => {
    res.json({
		loggedin: req.session.loggedin,
	});
	res.json(requestOptions);
};

module.exports = { loggedin };
