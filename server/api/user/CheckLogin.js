const { getUser } = require("../../model");
const CheckLogin = async (session) => {
	if (
		session &&
		typeof session.hash === "string" &&
		Date.now() < session.expiration
	) {
		const currentUser = await getUser(session);
		if (currentUser.error) {
			return { loggedin: false };
		}
		return { loggedin: true, hash: currentUser.hash };
	}

	return {
		loggedin: false,
		hash: session.hash,
		expiration: session.expiration,
	};
};

module.exports = { CheckLogin };
