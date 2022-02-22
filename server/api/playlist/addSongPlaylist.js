const { request } = require("../../utils");
const { invalidatePlaylist } = require("./invalidatePlaylist");
const { getSong } = require("../../model");

const addSongPlaylist = async (session, songuri, playlistId) => {
	const url =
		"https://api.spotify.com/v1/playlists/" + playlistId + "/tracks";
	const songs = { uris: [songuri], position: 0 };

	const response = await request(
		session.access_token,
		url,
		"POST",
		JSON.stringify(songs)
	);
	if (response.error) {
		return response;
	}

	invalidatePlaylist(playlistId, songuri);
	await getSong(session, songuri);

	return {
		message: "success",
		snapshot_id: response.snapshot_id,
	};
};

module.exports = { addSongPlaylist };
