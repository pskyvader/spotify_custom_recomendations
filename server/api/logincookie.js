const { User } = require("../database/connection");


const refreshcookie= async(req, res,currentUser) => {

}



const logincookie = async (req, res) => {
	let result = { error: null };
	if (
		!req.params.access_token ||
		typeof req.params.access_token === "undefined"
	) {
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
		if (Date.now() < meProfileResult.expiration) {
			req.session.loggedin = true;
			req.session.access_token = meProfileResult.access_token;
			req.session.refresh_token = meProfileResult.refresh_token;
			req.session.expiration = meProfileResult.expiration;
			meProfileResult.loggedin=true;
			result = meProfileResult;
			res.json(result);		
			return;
		}
		await refreshcookie(req,res,currentUser);
	}

	res.json(result);
};

module.exports = { logincookie };
