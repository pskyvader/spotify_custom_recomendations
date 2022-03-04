const { User } = require("../database");
const { refreshCookie } = require("../api/user/refreshCookie");

const { updateRecentSongs } = require("../tasks/updateRecentSongs");
const { removeFromPlaylist } = require("../tasks/removeFromPlaylist");
const { deleteOldRemoved } = require("../tasks/deleteOldRemoved");
const { addToPlaylist } = require("../tasks/addToPlaylist");

let LastTask = null;

const automaticTasks = async (req, res) => {
	const response = {
		error: false,
		message: "Not able to run task for next hour",
	};
	if (LastTask > Date.now() - 3600000) {
		response.error = true;
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
		removeFromPlaylist(user.access_token, user.id);
		addToPlaylist(user.access_token, user.id);
	});

	deleteOldRemoved();
	response.message = "Success";

	LastTask = Date.now();
	res.json(response);
};

module.exports = { automaticTasks };
