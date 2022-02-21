const { authorize } = require("./authorize");
const { pushtoken } = require("./pushtoken");
const { loggedin } = require("./loggedin");
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
