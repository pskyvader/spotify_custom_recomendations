const loggedin = (req, res) => {
	// console.log(
	// 	req.session.loggedin,
	// 	req.session.access_token
	// );

	res.json({
		loggedin: req.session
			? typeof req.session.loggedin === "string" &&
			  typeof req.session.access_token === "string"
			: false,
	});
};

module.exports = { loggedin };
