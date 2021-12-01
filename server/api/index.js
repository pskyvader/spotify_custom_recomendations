const { authorize } = require("./authorize");
const { pushtoken } = require("./pushtoken");
const { loggedin } = require("./loggedin");

module.exports = {
	authorize: authorize,
	pushtoken: pushtoken,
	loggedin: loggedin,
};
