const { request } = require("../../utils");
const { invalidatePlaylist } = require("../playlist");
const { getSong } = require("../../model");

const addSongPlaylist = async (req) => {
	const playlistId = req.params.playlistid;
	const songuri = req.params.songuri;
	const session = req.session;

	const url =
		"https://api.spotify.com/v1/playlists/" + playlistId + "/tracks";
	const songs = { uris: [songuri], position: 0 };

	const response = await request(session, url, "POST", JSON.stringify(songs));
	if (response.error) {
		return response;
	}

	invalidatePlaylist(playlistId, songuri);
	getSong(session, songuri);

	return {
		message: "success",
		snapshot_id: response.snapshot_id,
	};
};

module.exports = { addSongPlaylist };
