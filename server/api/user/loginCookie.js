const { Op } = require("sequelize");
const { User } = require("../../database");
const { refreshCookie } = require("./refreshCookie");

const loginCookie = async (req) => {
	const cookies = req.cookies;

	if (!cookies.hash) {
		return { error: "No access hash available" };
	}
	const currentUser = await User.findOne({
		where: {
			hash: cookies.hash,
		},
	});

	if (currentUser !== null) {
		const meProfileResult = {
			access_token: currentUser.access_token,
			refresh_token: currentUser.refresh_token,
			expiration: currentUser.expiration,
			hash: currentUser.hash,
		};
		if (Date.now() < meProfileResult.expiration) {
			req.session.loggedin = true;
			req.session.access_token = meProfileResult.access_token;
			req.session.refresh_token = meProfileResult.refresh_token;
			req.session.expiration = meProfileResult.expiration;
			req.session.hash = meProfileResult.hash;
			meProfileResult.loggedin = true;
			return meProfileResult;
		}
		return refreshCookie(req, currentUser);
	}
	return { error: "No user found" };
};

module.exports = { loginCookie };
