const { Op } = require("sequelize");
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
		message: "",
	};
	if (LastTask > Date.now() - 3600000) {
		response.error = true;
		response.message = "Not able to run task for next hour";
		res.json(response);
		return;
	}
	const { count, UserList } = await User.findAndCountAll({
		attributes: [
			"id",
			"access_token",
			"refresh_token",
			"expiration",
			"hash",
			"last_modified",
		],
		where: {
			last_modified: {
				[Op.lte]: Date.now() - 3600000,
			},
		},
	});
	if (count === 0) {
		response.message = "No users to update at this time";
		res.json(response);
		return;
	}

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
				response.message += `access token error for user ${user.id}`;
				return;
			}
		}
		await updateRecentSongs(user.access_token, user.id);
		if (user.last_modified > Date.now() - 24 * 3600000) {
			await removeFromPlaylist(user);
			await addToPlaylist(user);
		}
	});

	deleteOldRemoved();

	LastTask = Date.now();
	res.json(response);
};

module.exports = { automaticTasks };
