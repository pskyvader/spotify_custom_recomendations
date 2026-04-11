const { automaticTasks, runTasksAsync, tasks_ongoingRun } = require("./automaticTasks");
const { callback } = require("./callback");
const { login } = require("./login");

module.exports = {
	automaticTasks,
	runTasksAsync,
	tasks_ongoingRun,
	callback,
	login,
};
