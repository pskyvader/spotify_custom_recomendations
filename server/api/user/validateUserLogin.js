const { createUser, getUser, updateUser } = require("../../model");
const { refreshCookie, getUser: getUserAPI } = require("../../spotifyapi/user");

const getOrCreateUser = async (loginData) => {
	console.log("loginData", loginData);
	const thisUser = await getUser(loginData);
	if (thisUser.error) {
		return thisUser;
	}
	if (thisUser !== null) {
		return thisUser.update(loginData);
	}
	const formattedUser = await getUserAPI(loginData.access_token, loginData);
	if (formattedUser.error) {
		if (formattedUser.status === 401) {
			formattedUser.error = false;
		}
		return formattedUser;
	}
	const finalUser = await getUser(formattedUser);
	if (finalUser.error) {
		return finalUser;
	}
	if (finalUser !== null) {
		return finalUser.update(formattedUser);
	}

	return createUser(formattedUser);
};

const validateUserLogin = async (loginData) => {
	const response = { error: true, message: "" };
	if (!loginData) {
		response.message = "No user data found";
		return response;
	}
	const currentUser = await getOrCreateUser(loginData);
	if (currentUser.error) {
		return currentUser;
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
