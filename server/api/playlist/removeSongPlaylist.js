const { Op } = require("sequelize");
const { request } = require("../../utils");
const { invalidatePlaylist } = require("./invalidatePlaylist");
const { Song } = require("../../database");
const { getSong } = require("../../model");

const removeSongPlaylist = async (session, songuri, playlistId) => {
	const url =
		"https://api.spotify.com/v1/playlists/" + playlistId + "/tracks";

	const songs = {
		tracks: [{ uri: songuri }],
	};

	const response = await request(
		session.access_token,
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
	Song.update(deletedSong, {
		where: {
			[Op.and]: [{ iduser: deletedSong.iduser }, { id: deletedSong.id }],
		},
	});

	return {
		message: "success",
		snapshot_id: response.snapshot_id,
	};
};

module.exports = { removeSongPlaylist };
