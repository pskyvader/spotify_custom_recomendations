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
