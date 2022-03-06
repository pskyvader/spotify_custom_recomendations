const CheckLogin = (session) => {
	let isLoggedIn = false;
	if (
		session &&
		typeof session.hash === "string" &&
		Date.now() < session.expiration
	) {
		isLoggedIn = true;
	}

	return { loggedin: isLoggedIn, hash: session.hash };
};

module.exports = { CheckLogin };
