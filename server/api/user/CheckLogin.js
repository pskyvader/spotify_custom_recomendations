const CheckLogin = (session) => {
	let isLoggedIn = false;
	if (
		session &&
		typeof session.access_token === "string" &&
		Date.now() < session.expiration
	) {
		isLoggedIn = true;
	}

	return { loggedin: isLoggedIn, access_token: session.access_token };
};

module.exports = { CheckLogin };
