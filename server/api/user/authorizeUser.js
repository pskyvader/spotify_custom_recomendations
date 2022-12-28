const { credentials } = require("../../credentials");
const { getAuthorizationObject } = require("../../spotifyapi/user");
const authorizeUser = ({ query }) => {
	const code = query.code || null;
	const state = query.state || null;

	if (code === null) {
		return { error: true, message: "Missing code" };
	}
	if (state === null) {
		return { error: true, message: "Missing state" };
	}
	return getAuthorizationObject(code);
};

module.exports = { authorizeUser };
