const { Op } = require("sequelize");
const { User } = require("../database");
const { refreshCookie } = require("../api/user/refreshCookie");

const {
	updateRecentSongs,
	removeFromPlaylist,
	deleteOldRemoved,
	addToPlaylist,
	deleteUnlinkedSongs,
	updateAverageTimes,
} = require("../tasks");

const hour = 3600000;
const tenMinutes = 600000;
const week = 86400000;

let LastTask = null;

const hourlyTasks = async () => {
	return null;
};

const dailyTasks = async () => {
	console.log("--------------------------------");
	console.log("Daily Tasks");
	const deleteResponse = await deleteOldRemoved();
	console.log("deleted all", deleteResponse);

	const deleteUnlinkedResponse = await deleteUnlinkedSongs();
	console.log("deleted unlinked", deleteUnlinkedResponse);
};

const getAvailableUsers = async () => {
	console.log("--------------------------------");
	console.log("Getting Available Users");
	const userList = await User.findAll({
		attributes: [
			"id",
			"name",
			"access_token",
			"refresh_token",
			"expiration",
			"hash",
			"last_modified",
		],
		where: {
			last_modified: {
				[Op.lte]: Date.now() - hour,
			},
		},
	});

	const availabeUsersList = [];
	for (const user of userList) {
		console.log(`User ${user.name} (${user.id})`);
		if (user.expiration < Date.now() + tenMinutes) {
			const falseReq = { session: { access_token: user.access_token } };
			const result = await refreshCookie(falseReq, user);
			if (result.error) {
				console.error(`access token error, cannot continue`);
				continue;
			}
			console.log(`got Refresh token`);
			user.access_token = result.access_token;
			user.expiration = result.expiration;
			availabeUsersList.push(user);
		}
		console.log(
			`User available, date: ${new Date(
				Date.now() + tenMinutes
			).toString()}, expiration:${user.expiration}`
		);
		availabeUsersList.push(user);
	}
	return availabeUsersList;
};

const automaticTasks = async (req, res) => {
	const response = {
		error: false,
		message: [],
	};
	if (LastTask > Date.now() - hour) {
		response.error = true;
		response.message = "Not able to run task for next hour";
		res.json(response);
		return;
	}
	const UserList = await getAvailableUsers();
	if (UserList.length === 0) {
		response.message = "No users to update at this time";
	}

	for (const user of UserList) {
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

		if (user.last_modified < Date.now() - week) {
			const songsToModify = 5 + Math.floor(Math.random() * 5);
			const averageListeningTime = updateAverageTimes(user);
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
		} else {
			console.log(
				`User ${user.name} not yet able for daily updates`,
				new Date(user.last_modified).toString(),
				new Date(Date.now()).toString()
			);
		}
		response.message.push(`User ${user.name} has been updated`);
	}

	dailyTasks();
	LastTask = Date.now();
	res.json(response);
};

module.exports = { automaticTasks };
