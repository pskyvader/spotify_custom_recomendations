const { getUser, updateUser } = require("../../model");
const { refreshCookie } = require("./refreshCookie");

const validateUserLogin = async (loginData) => {
	const response = { error: true, message: "" };
	if (!loginData) {
		response.message = "No user data found";
		return response;
	}
	const currentUser = await getUser(loginData);
	if (currentUser.error) {
		return currentUser;
	}

	if (Date.now() > new Date(currentUser.expiration)) {
		const refreshData = await refreshCookie(currentUser);
		if (refreshData.error) {
			return refreshData;
		}
		return updateUser(refreshData);
	}
	return currentUser;
};

module.exports = { validateUserLogin };
