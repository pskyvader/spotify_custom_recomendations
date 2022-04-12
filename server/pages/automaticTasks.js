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
		if (user.expiration < Date.now() + 600000) {
			const falseReq = { session: { access_token: user.access_token } };
			const result = await refreshCookie(falseReq, user);
			if (result.error) {
				console.error(
					`access token error for user ${user.id}, cannot continue`
				);
				response.message.push(`access token error for user ${user.id}`);
				continue;
			}
			console.log(`user ${user.id} Refresh token`); //, result);
			user.access_token = result.access_token;
		} else {
			console.log(
				`user ${
					user.id
				} should be able to process requests, date: ${new Date(
					Date.now() + 600000
				).toString()}, expiration:${user.expiration}`
			);
		}

		response.message.push(
			`User ${user.id} last modified: ${user.last_modified}`
		);
		console.log(`Updating recents for user ${user.id}`);
		const updateResult = await updateRecentSongs(
			user.access_token,
			user.id
		);
		if (updateResult.error) {
			console.log(updateResult, user.expiration);
		} else {
			console.log(`User ${user.id} updated`);
		}

		if (user.last_modified < Date.now() - 86400000) {
			console.log(`Remove for user ${user.id}`);
			const removeResponse = await removeFromPlaylist(user);
			console.log(`User ${user.id}`, removeResponse);
			console.log(`Add for user ${user.id}`);
			const addResponse = await addToPlaylist(user);
			console.log(`User ${user.id} Added response:`, addResponse);
			console.log(`Date for user ${user.id}`);
			await User.update(
				{ last_modified: Date.now() },
				{ where: { id: user.id } }
			);
			response.message.push(
				`User ${user.id} Daily playlists has been updated`
			);
		} else {
			console.log(
				`User ${user.id} not yet able for daily updates`,
				new Date(user.last_modified).toString(),
				new Date(Date.now()).toString()
			);
		}
		response.message.push(`User ${user.id} has been updated`);
	}
	const deleteResponse = await deleteOldRemoved();
	console.log("deleted all", deleteResponse);

	LastTask = Date.now();
	res.json(response);
};

module.exports = { automaticTasks };
