const { validateUserLogin } = require("./validateUserLogin");

const loginCookie = async (req) => {
	const cookies = { ...req.cookies };
	if (cookies.id) {
		delete cookies.id;
	}
	console.log("Login cookie: ", cookies);
	const currentUser = await validateUserLogin(cookies);
	if (!currentUser.error) {
		req.session.loggedin = true;
		req.session.access_token = currentUser.access_token;
		req.session.refresh_token = currentUser.refresh_token;
		req.session.expiration = currentUser.expiration;
		req.session.hash = currentUser.hash;
	}
	return currentUser;
};

module.exports = { loginCookie };
