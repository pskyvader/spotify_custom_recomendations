const { Op } = require("sequelize");
const { User, Playlist } = require("../database");
const { refreshCookie } = require("../api/user/refreshCookie");

const {
	updateRecentSongs,
	removeFromPlaylist,
	deleteOldRemoved,
	addToPlaylist,
	deleteUnlinkedSongs,
	updateAverageTimes,
} = require("../tasks");

const hour= 3600000;
let LastTask = null;
const automaticTasks = async (req, res) => {
	const response = {
		error: false,
		message: [],
	};
	// if (LastTask > Date.now() - hour) {
	// 	response.error = true;
	// 	response.message = "Not able to run task for next hour";
	// 	res.json(response);
	// 	return;
	// }
	const { count, rows } = await User.findAndCountAll({
		attributes: [
			"id",
			"name",
			"access_token",
			"refresh_token",
			"expiration",
			"hash",
			"last_modified",
		],
		// where: {
		// 	last_modified: {
		// 		[Op.lte]: Date.now() - hour,
		// 	},
		// },
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
					`access token error for user ${user.name}, cannot continue`
				);
				response.message.push(
					`access token error for user ${user.name}`
				);
				continue;
			}
			console.log(`user ${user.name} Refresh token`); //, result);
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
			`User ${user.name} last modified: ${user.last_modified}`
		);
		console.log(`Updating recents for user ${user.name}`);
		const updateResult = await updateRecentSongs(
			user.access_token,
			user.id
		);
		if (updateResult.error) {
			console.log(updateResult, user.expiration);
		} else {
			console.log(`User ${user.name} updated`);
		}

		// if (user.last_modified < Date.now() - 86400000) {
			const songsToModify = 5 + Math.floor(Math.random() * 5);
			const averageListeningTime = await updateAverageTimes(user);
			console.log(
				`User ${user.name} listening daily time is ${averageListeningTime}`
			);
			console.log(`Remove for user ${user.name}`);
			const removeResponse = await removeFromPlaylist(
				user,
				songsToModify
			);
			console.log(`User ${user.name}`, removeResponse);
			console.log(`Add for user ${user.name}`);
			const addResponse = await addToPlaylist(user, songsToModify);
			console.log(`User ${user.name} Added response:`, addResponse);
			console.log(`Date for user ${user.name}`);
			await User.update(
				{ last_modified: Date.now() },
				{ where: { id: user.id } }
			);
			response.message.push(
				`User ${user.name} Daily playlists has been updated`
			);
		// } else {
		// 	console.log(
		// 		`User ${user.name} not yet able for daily updates`,
		// 		new Date(user.last_modified).toString(),
		// 		new Date(Date.now()).toString()
		// 	);
		// }
		response.message.push(`User ${user.name} has been updated`);
	}
	const deleteResponse = await deleteOldRemoved();
	console.log("deleted all", deleteResponse);

	const deleteUnlinkedResponse = await deleteUnlinkedSongs();
	console.log("deleted unlinked", deleteUnlinkedResponse);

	LastTask = Date.now();
	res.json(response);
};

module.exports = { automaticTasks };
