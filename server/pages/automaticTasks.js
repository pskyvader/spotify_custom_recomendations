const { User } = require("../database");
const { refreshCookie } = require("../api/user/refreshCookie");

const { getHourlyTasks, getDailyTasks } = require("../tasks");

const hour = 3600000;
const tenMinutes = 600000;
const day = 86400000;
let LastTask = null;

const getAvailableUsers = async () => {
	console.log("--------------------------------");
	console.log("Getting Available Users");
	const userList = await User.findAll().catch((err) => ({
		error: err.message,
	}));
	if (userList.error) {
		return userList;
	}
	const availableUsersList = { hourly: [], daily: [] };

	for (const user of userList) {
		console.log("-----");
		console.log(`User ${user.name} (${user.id})`);
		if (user.expiration < Date.now() + tenMinutes) {
			const result = await refreshCookie(user);
			if (result.error) {
				console.error(`access token error, cannot continue`);
				continue;
			}
			console.log(`got Refresh token`);
			user.access_token = result.access_token;
			user.expiration = result.expiration;
		}
		console.log(`User available, expiration:${user.expiration}`);
		if (user.last_modified_hourly < Date.now() - hour) {
			availableUsersList.hourly.push(user);
		}
		if (user.last_modified_daily < Date.now() - day) {
			availableUsersList.daily.push(user);
		}
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
	console.log("error", userList);

	const hourlyTaskList = getHourlyTasks(userList.hourly);
	const dailyTaskList = getDailyTasks(userList.daily);

	console.log("Hourly Tasks...");
	await Promise.all(hourlyTaskList).then(() => {
		console.log("Hourly Tasks Done");
	});
	console.log("Daily Tasks...");
	await Promise.all(dailyTaskList).then(() => {
		console.log("Daily Tasks Done");
	});

	LastTask = Date.now();
	res.json(response);
};

module.exports = { automaticTasks };
