let LastTask = Date.now();
const automaticTasks = (req, res) => {
	const response = { error: false };
	if (LastTask > Date.now() - 3600000) {
		response.error = true;
		response.message = "Not able to run task for next hour";
	}
	LastTask = Date.now();
	res.json(response);
};

module.exports = { automaticTasks };
