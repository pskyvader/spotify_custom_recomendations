const { formatPlaylist, formatPlaylistGroup } = require("./formatPlaylist");
const { getPlaylist } = require("./getPlaylist");
const { addSong } = require("./addSong");
const { removeSong } = require("./removeSong");

module.exports = {
	formatPlaylist,
	formatPlaylistGroup,
	getPlaylist,
	addSong,
	removeSong,
};
