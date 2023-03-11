const { createUser, getUser } = require("../../model");
const { refreshCookie, getUser: getUserAPI } = require("../../spotifyapi/user");

const tenMinutes = 600000;
const validateUserLogin = async (loginData) => {
	const response = { error: true, message: "" };

	let user = await getUser(loginData);

	if (user !== null) {
		if (user.error || new Date(user.expiration) > Date.now() + tenMinutes) {
			return user;
		}

		loginData = { ...user.toJSON(), ...loginData };
	}

	if (
		!loginData ||
		!loginData.hash ||
		!loginData.access_token ||
		!loginData.expiration
	) {
		response.message = "No valid user data found";
		return response;
	}

	loginData = await refreshCookie(loginData);

	if (loginData.error) {
		return loginData;
	}

	const formattedUser = await getUserAPI(loginData.access_token, loginData);
	if (formattedUser.error) {
		return formattedUser;
	}
	const thisUser = await getUser(formattedUser);

	if (thisUser === null) {
		return createUser(formattedUser);
	}

	if (thisUser.error) {
		return thisUser;
	}

	return thisUser.update({ ...formattedUser, hash: thisUser.hash }); // preserve hash so it can be used to log in via cookies
};

module.exports = { validateUserLogin };
