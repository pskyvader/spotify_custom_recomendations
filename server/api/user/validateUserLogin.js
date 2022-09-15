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
		if (currentUser.status !== 401) {
			return currentUser;
		}
		currentUser.access_token = loginData.access_token;
		currentUser.refresh_token = loginData.refresh_token;
		currentUser.hash = loginData.hash;
	}

	if (
		currentUser.status === 401 ||
		Date.now() > new Date(currentUser.expiration)
	) {
		const refreshData = await refreshCookie(currentUser);
		if (refreshData.error) {
			return refreshData;
		}
		const newUser = await updateUser(refreshData);
		return newUser;
	}
	return currentUser;
};

module.exports = { validateUserLogin };
