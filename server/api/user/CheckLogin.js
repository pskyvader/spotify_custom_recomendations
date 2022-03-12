const { getUser } = require("../../model");
const CheckLogin = async (session) => {
	if (
		session &&
		typeof session.hash === "string" &&
		Date.now() < new Date(session.expiration) 
	) {
		const currentUser = await getUser(session);
		if (currentUser.error) {
			currentUser.loggedin = false;
			return currentUser;
		}
		return { loggedin: true, hash: currentUser.hash };
	}

	return {
		loggedin: false,
		// hash: session.hash,
		// expiration: session.expiration,
		// current_date: Date.now(),
		// difference: new Date(session.expiration) - Date.now(),
		// is_string: typeof session.hash === "string",
		// is_valid: Date.now() < session.expiration,
	};
};

module.exports = { CheckLogin };
