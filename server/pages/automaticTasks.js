const { User } = require("../database");
const { refreshCookie } = require("../api/user/refreshCookie");

const { updateRecentSongs } = require("../tasks/updateRecentSongs");
const { updateOldRecent } = require("../tasks/updateOldRecent");
const { deleteOldRemoved } = require("../tasks/deleteOldRemoved");

let LastTask = Date.now();

const automaticTasks = async (req, res) => {
	const response = { error: false };
	if (LastTask > Date.now() - 3600000) {
		response.error = true;
		response.message = "Not able to run task for next hour";
		res.json(response);
		return;
	}
	const UserList = await User.findAll({
		attributes: ["id", "access_token", "refresh_token", "expiration"],
	});
	UserList.every(async (user) => {
		if (user.expiration < Date.now()) {
			console.log(
				"token expired for user:",
				user.id,
				". Getting new token"
			);
			const falseReq = { session: { access_token: user.access_token } };
			const result = await refreshCookie(falseReq, user);
			if (result.error) {
				console.error("access token error for user", user.id);
				return;
			}
		}
		updateRecentSongs(user.access_token, user.id);
	});

	updateOldRecent();
	deleteOldRemoved();
	response.message = "Success";

	LastTask = Date.now();
	res.json(response);
};

module.exports = { automaticTasks };
