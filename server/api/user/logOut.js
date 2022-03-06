const logOut = (req) => {
	req.session.access_token = null;
	req.session.refresh_token = null;
	req.session.expiration = null;
	req.session.hash = null;
};

module.exports = { logOut };
