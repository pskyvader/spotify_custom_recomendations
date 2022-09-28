const { generateRandomString } = require("./generateRandomString");
const { request } = require("./request");
const { genres } = require("./genres");
const { convertTime } = require("./convertTime");
const { formatSongAPI, formatSongAPIList } = require("./formatSong");

module.exports = {
	generateRandomString,
	request,
	genres,
	convertTime,
	formatSongAPI,
	formatSongAPIList,
};
