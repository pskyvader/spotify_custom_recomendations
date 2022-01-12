const { User } = require("../database/connection");

const logincookie = async (req, res) => {
	if (!req.params.access_token) {
		return { error: "No access token available" };
	}
	console.log("b");

	const currentUser = await User.findOne({
		where: { access_token: req.params.access_token },
	});
	console.log("c");
	if (currentUser !== null) {
		const meProfileResult = {
			access_token: currentUser.access_token,
			refresh_token: currentUser.refresh_token,
			expiration: currentUser.expiration,
		};
		console.log(meProfileResult);

		return meProfileResult;
	}
	console.log("d");
};

module.exports = { logincookie };
