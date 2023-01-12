const { createUser, getUser } = require("../../model");
const { refreshCookie, getUser: getUserAPI } = require("../../spotifyapi/user");

const validateUserLogin = async (loginData) => {
	console.log("User validation");
	const response = { error: true, message: "" };
	let user = await getUser(loginData);
	console.log("Getting user from database using login data", user);
	if (user !== null) {
		console.log("User not null");
		if (user.error || Date.now() > new Date(user.expiration)) {
			console.log("User found or error", user);
			return user;
		}
		console.log("User expired", user, "login data", loginData);
		loginData = { ...user, ...loginData };
		console.log("Merged Data", loginData);
	}

	if (
		!loginData ||
		!loginData.hash ||
		!loginData.access_token ||
		!loginData.expiration
	) {
		console.log("Invalid user Data", loginData);
		response.message = "No valid user data found";
		return response;
	}

	console.log("Refreshing cookie", loginData);
	// if (Date.now() < new Date(loginData.expiration)) {
	loginData = await refreshCookie(loginData);

	console.log("After refresh", loginData);
	if (loginData.error) {
		console.log("error on refresh", loginData);
		return loginData;
	}
	// }

	const formattedUser = await getUserAPI(loginData.access_token, loginData);
	if (formattedUser.error) {
		console.log("error on get user from api", formattedUser);
		return formattedUser;
	}
	const thisUser = await getUser(formattedUser);
	console.log("Getting user from database using api data", thisUser);
	if (thisUser === null) {
		console.log("Creating user in Database", formattedUser);
		return createUser(formattedUser);
	}

	if (thisUser.error) {
		console.log("Error getting user");
		return thisUser;
	}
	console.log("Updating user in Database", formattedUser);
	return thisUser.update(formattedUser);
};

module.exports = { validateUserLogin };
