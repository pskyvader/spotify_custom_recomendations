const { authorize } = require("./user/authorizeUser");
const { pushtoken } = require("./user/pushToken");
const { loggedin } = require("./user/loggedin");
const { me } = require("./me");
const { playlist } = require("./playlist");
const { addSongPlaylist, removeSongPlaylist } = require("./actions");
const { logincookie } = require("./logincookie");

module.exports = {
	authorize,
	pushtoken,
	loggedin,
	me,
	playlist,
	addSongPlaylist,
	removeSongPlaylist,
	logincookie,
};
