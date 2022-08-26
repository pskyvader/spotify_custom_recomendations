const { generateRandomString } = require("./generateRandomString");
const { request } = require("./request");
const { genres } = require("./genres");
const { subtractById } = require("./subtractById");
const { convertTime } = require("./convertTime");

module.exports = {
	generateRandomString,
	request,
	genres,
	subtractById,
	convertTime,
};
