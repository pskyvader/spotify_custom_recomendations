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
		console.log(`Expiration: ${user.expiration}`);
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
	let response = {
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

	const hourlyTaskList = getHourlyTasks(userList.hourly);
	const dailyTaskList = getDailyTasks(userList.daily);

	if (hourlyTaskList.length > 0) {
		response.message.push(`Hourly task for ${hourlyTaskList.length} users`);
		response = await Promise.all(hourlyTaskList)
			.then((responses) => {
				const totalresponses = [];
				for (const r in responses) {
					totalresponses.push(...responses[r].message);
				}
				response.message.push("Hourly Tasks Done");
				response.message.push(...totalresponses);
				return response;
			})
			.then((response) => {
				if (dailyTaskList.length > 0) {
					response.message.push(
						`Daily task for ${dailyTaskList.length} users`
					);
					return Promise.all(dailyTaskList).then((responses) => {
						const totalresponses = [];
						for (const r in responses) {
							totalresponses.push(...responses[r]);
						}
						response.message.push("Daily Tasks Done");
						response.message.push(...totalresponses);
						return response;
					});
				}
			});
	}

	LastTask = Date.now();
	return response;
};

module.exports = { automaticTasks };
