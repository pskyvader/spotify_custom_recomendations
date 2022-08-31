const { getUser } = require("../../model");
const { refreshCookie } = require("./refreshCookie");

const validateUserLogin = async (loginData) => {
	const response = { error: true, message: "" };
	if (!loginData) {
		response.message = "No user data found";
		return response;
	}
	const currentUser = await getUser(session);
	if (currentUser.error) {
		return currentUser;
	}

	if (Date.now() > new Date(currentUser.expiration)) {
		const refreshData = await refreshCookie(currentUser);
	}

	return null;
};

module.exports = { validateUserLogin };
