const { createUser, getUser } = require("../../model");
const { refreshCookie, getUser: getUserAPI } = require("../../spotifyapi/user");

const getAndUpdateUser = (newData) => {
	return getUser(newData).then((thisUser) => {
		if (thisUser !== null) {
			if (thisUser.error) {
				return thisUser;
			}
			return thisUser.update(newData);
		}
		if (newData.id) {
			return createUser(newData);
		}
		return getUserAPI(newData.access_token, newData).then(
			(formattedUser) => {
				if (formattedUser.error) {
					// if (formattedUser.status === 401) {
					// 	formattedUser.error = false;
					// }
					return formattedUser;
				}
				return getAndUpdateUser(formattedUser);
			}
		);
	});
};

const validateUserLogin = async (loginData) => {
	const response = { error: true, message: "" };
	if (
		!loginData ||
		!loginData.hash ||
		!loginData.access_token ||
		!loginData.expiration
	) {
		response.message = "No valid user data found";
		return response;
	}

	if (Date.now() < new Date(loginData.expiration)) {
		loginData = await refreshCookie(loginData);
		if (loginData.error) {
			return loginData;
		}
	}

	return getAndUpdateUser(loginData);

	// if (user.error) {
	// 	return user;
	// }

	// const newUser = await getAndUpdateUser(refreshData);
	// return newUser;
};

module.exports = { validateUserLogin };
