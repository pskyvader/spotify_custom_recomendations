const { User } = require("../database");
const { refreshCookie } = require("../api/user/refreshCookie");

const { getHourlyTasks, getDailyTasks } = require("../tasks");

const hour = 3600000;
const tenMinutes = 600000;
const day = 86400000;
let LastTask = Date.now() - day;

const getAvailableUsers = async () => {
	const response = {
		hourly: [],
		daily: [],
		message: [],
		error: false,
	};
	response.message.push("--------------------------------");
	response.message.push("Getting Available Users");
	const userList = await User.findAll().catch((err) => ({
		error: true,
		message: err.message,
	}));
	if (userList.error) {
		return userList;
	}

	for (const user of userList) {
		response.message.push("-----");
		response.message.push(`User ${user.name} (${user.id})`);
		if (user.expiration < Date.now() + tenMinutes) {
			const result = await refreshCookie(user);
			if (result.error) {
				response.message.push(`access token error, cannot continue`);
				continue;
			}
			response.message.push(`got Refresh token`);
			user.access_token = result.access_token;
			user.expiration = result.expiration;
		}
		response.message.push(`Expiration: ${user.expiration}`);
		if (user.last_modified_hourly < Date.now() - hour + tenMinutes) {
			response.hourly.push(user);
		}
		if (user.last_modified_daily < Date.now() - day + tenMinutes) {
			response.daily.push(user);
		}
	}
	response.message.push("--------------------------------");
	return response;
};

const automaticTasks = async () => {
	let response = {
		error: false,
		message: [],
	};
	if (LastTask > Date.now() - hour + tenMinutes) {
		response.error = true;
		response.message = "Not able to run task for next hour";
		return response;
	}
	const userList = await getAvailableUsers();
	response.error = response.error || userList.error;
	response.message.push(...userList.message);
	const hourlyTaskList = getHourlyTasks(userList.hourly);
	const dailyTaskList = getDailyTasks(userList.daily);

	if (hourlyTaskList.length > 0) {
		response.message.push(`Hourly task for ${hourlyTaskList.length} users`);
		const promiseResponse = await Promise.allSettled(hourlyTaskList)
			.then((hourlyResponses) => {
				const totalresponses = { message: [], error: false };
				for (const r in hourlyResponses) {
					totalresponses.error =
						totalresponses.error || hourlyResponses[r].value.error;
					totalresponses.message.push(
						...hourlyResponses[r].value.message
					);
					totalresponses.message.push("----");
				}
				totalresponses.message.push("Hourly Tasks Done");
				totalresponses.message.push("--------------------");
				return totalresponses;
			})
			.then((previousResponse) => {
				if (dailyTaskList.length === 0) {
					return previousResponse;
				}
				previousResponse.message.push(
					`Daily task for ${userList.daily.length} users`
				);
				return Promise.allSettled(dailyTaskList).then((responses) => {
					for (const r in responses) {
						previousResponse.error =
							previousResponse.error || responses[r].value.error;
						previousResponse.message.push(
							...responses[r].value.message
						);
						previousResponse.message.push("----");
					}
					previousResponse.message.push("Daily Tasks Done");
					previousResponse.message.push("--------------------");
					return previousResponse;
				});
			});
		response.error = response.error || promiseResponse.error;
		response.message.push(...promiseResponse.message);
	}

	LastTask = Date.now();
	return response;
};

module.exports = { automaticTasks };
