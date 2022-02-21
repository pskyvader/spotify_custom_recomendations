const { request } = require("../../utils");
const { invalidatePlaylist } = require("../playlist");
const { Song } = require("../../database");
const { getSong } = require("../../model");

const removeSongPlaylist = async (req, res) => {
	const playlistId = req.params.playlistid;
	const songuri = req.params.songuri;
	const session = req.session;
	const url =
		"https://api.spotify.com/v1/playlists/" + playlistId + "/tracks";

	const songs = {
		tracks: [{ uri: songuri }],
	};

	const response = await request(
		session,
		url,
		"DELETE",
		JSON.stringify(songs)
	);
	if (response.error) {
		return response;
	}

	invalidatePlaylist(playlistId, songuri);
	const deletedSong = getSong(session, songuri);
	deletedSong.removed = true;
	deletedSong.song_removed = Date.now();
	Song.update(deletedSong);

	return {
		message: "success",
		snapshot_id: response.snapshot_id,
	};
};

module.exports = { removeSongPlaylist };
