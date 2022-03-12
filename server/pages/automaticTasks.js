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
		message: [],
	};
	if (LastTask > Date.now() - 3600000) {
		response.error = true;
		response.message = "Not able to run task for next hour";
		res.json(response);
		return;
	}
	const { count, rows } = await User.findAndCountAll({
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
	const UserList = rows;

	for (const user of UserList) {
		if (user.expiration < Date.now()) {
			console.log(
				"token expired for user:",
				user.id,
				". Getting new token"
			);
			const falseReq = { session: { access_token: user.access_token } };
			const result = await refreshCookie(falseReq, user);
			if (result.error) {
				console.error(`access token error for user ${user.id}`);
				response.message.push(`access token error for user ${user.id}`);
				continue;
			}
		}

		response.message.push(
			`User ${user.id} last modified: ${user.last_modified}`
		);
		await updateRecentSongs(user.access_token, user.id);
		if (user.last_modified < Date.now() - 24 * 3600000) {
			await removeFromPlaylist(user);
			await addToPlaylist(user);
			await User.update(
				{ last_modified: Date.now() },
				{ where: { id: user.id } }
			);
			response.message.push(
				`User ${user.id} Daily playlists has been updated`
			);
		}
		response.message.push(`User ${user.id} has been updated`);
	}

	await deleteOldRemoved();

	LastTask = Date.now();
	res.json(response);
};

module.exports = { automaticTasks };
