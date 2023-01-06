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
					if (formattedUser.status === 401) {
						formattedUser.error = false;
					}
					return formattedUser;
				}
				return getAndUpdateUser(formattedUser);
			}
		);
	});
};

const validateUserLogin = async (loginData) => {
	console.log("loginData", loginData);
	const response = { error: true, message: "" };
	if (!loginData) {
		response.message = "No user data found";
		return response;
	}

	const user = await getAndUpdateUser(loginData);
	if (
		user.error ||
		(user.status !== 401 && Date.now() < new Date(user.expiration))
	) {
		return user;
	}
	const refreshData = await refreshCookie(loginData);
	if (refreshData.error) {
		return refreshData;
	}
	const newUser = await getAndUpdateUser(refreshData);
	return newUser;
};

module.exports = { validateUserLogin };
