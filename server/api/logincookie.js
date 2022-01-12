const { User } = require("../database/connection");

const logincookie = async (req, res) => {
	let result = { error: null };
	if (!req.params.access_token || typeof req.params.access_token==="undefined") {
		result = { error: "No access token available" };
	}
	const currentUser = await User.findOne({
		where: { access_token: req.params.access_token },
	});
	if (currentUser !== null) {
		const meProfileResult = {
			access_token: currentUser.access_token,
			refresh_token: currentUser.refresh_token,
			expiration: currentUser.expiration,
		};

		result = meProfileResult;
	}

	res.json(result);
};

module.exports = { logincookie };
