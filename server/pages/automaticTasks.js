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
	console.log("--------------------------------");
	return availableUsersList;
};

const automaticTasks = async () => {
	let response = {
		error: false,
		message: [],
	};
	if (LastTask > Date.now() - hour) {
		response.error = true;
		response.message = "Not able to run task for next hour";
		return response;
	}
	const userList = await getAvailableUsers();
	const hourlyTaskList = getHourlyTasks(userList.hourly);
	const dailyTaskList = getDailyTasks(userList.daily);

	if (hourlyTaskList.length > 0) {
		response.message.push(`Hourly task for ${hourlyTaskList.length} users`);
		const promiseResponse = await Promise.all(hourlyTaskList)
			.then((hourlyResponses) => {
				const totalresponses = { message: [] };
				for (const r in hourlyResponses) {
					totalresponses.message.push(...hourlyResponses[r].message);
				}
				totalresponses.message.push("Hourly Tasks Done");
				totalresponses.message.push("--------------------");
				return totalresponses;
			})
			.then((previousResponse) => {
				if (dailyTaskList.length > 0) {
					previousResponse.message.push(
						`Daily task for ${userList.daily.length} users`
					);
					return Promise.all(dailyTaskList).then((responses) => {
						for (const r in responses) {
							previousResponse.error =
								previousResponse.error || responses[r].error;
							previousResponse.message.push(
								...responses[r].message
							);
						}
						previousResponse.message.push("Daily Tasks Done");
					});
				}
				return previousResponse;
			});
		response.error ||= promiseResponse.error;

		response.message.push(...promiseResponse.message);
	}

	LastTask = Date.now();
	return response;
};

module.exports = { automaticTasks };
