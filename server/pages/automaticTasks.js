const { Op } = require("sequelize");
const { User } = require("../database");
const { refreshCookie } = require("../api/user/refreshCookie");
const { convertTime } = require("../utils");

const {
	updateRecentSongs,
	removeFromPlaylist,
	deleteOldRemoved,
	addToPlaylist,
	deleteUnlinkedSongs,
	updateAverageTimes,
	addMissingSongs,
	removeMissingSongs,
} = require("../tasks");

const hour = 3600000;
const tenMinutes = 600000;
const day = 86400000;
let LastTask = null;

const hourlyTasks = async (userList) => {
	console.log("--------------------------------");
	console.log("Hourly Tasks");
	for (const user of userList) {
		console.log("-----");
		console.log(`User ${user.name}`);
		console.log(`Last modified: ${user.last_modified}`);
		console.log(`Updating recent songs...`);
		const updateResult = await updateRecentSongs(
			user.access_token,
			user.id
		);
		if (updateResult.error) {
			console.log("Update error", updateResult);
		} else {
			console.log(`Updated`);
		}
	}
};

const dailyTasks = async (userList) => {
	console.log("--------------------------------");
	console.log("Daily Tasks");

	for (const user of userList) {
		console.log("-----");
		console.log(`User ${user.name}`);
		if (user.dailyAvailable) {
			const songsToModify = 5 + Math.floor(Math.random() * 5);
			const averageListeningTime = await updateAverageTimes(user);
			console.log(
				`Listening daily time is ${averageListeningTime.average}`
			);
			console.log(`Remove Songs`);
			const removeResponse = await removeFromPlaylist(
				user,
				songsToModify
			);
			console.log(removeResponse);
			console.log(`Add Songs`);
			const addResponse = await addToPlaylist(user, songsToModify);
			console.log(addResponse);

			const removeMissingResponse = await removeMissingSongs(user);
			console.log("Remove Missing Songs: ", removeMissingResponse);

			const addMissingResponse = await addMissingSongs(user);
			console.log("Add Missing Songs: ", addMissingResponse);

			await User.update(
				{ last_modified: Date.now() },
				{ where: { id: user.id } }
			);
			console.log(`Playlists Updated`);
			continue;
		}
		console.log(
			`Not yet available, remaining ${convertTime(
				new Date(Date.now()).getTime() -
					new Date(user.last_modified).getTime()
			)}`
		);
	}
	console.log("--------------------------------");

	const deleteResponse = await deleteOldRemoved();
	console.log("deleted all", deleteResponse);
	console.log("--------------------------------");

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

	const availableUsersList = [];
	for (const user of userList) {
		console.log("-----");
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
		}
		console.log(`User available, expiration:${user.expiration}`);
		user.dailyAvailable = user.last_modified < Date.now() - day;
		availableUsersList.push(user);
	}
	return availableUsersList;
};

const automaticTasks = async (_req, res) => {
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
	const userList = await getAvailableUsers();
	console.log(`${userList.length} users available`);
	if (userList.length === 0) {
		response.message = "No users to update at this time";
	} else {
		response.message = `Updating ${userList.length} users`;
	}

	await hourlyTasks(userList);
	await dailyTasks(userList);
	LastTask = Date.now();
	res.json(response);
};

module.exports = { automaticTasks };
