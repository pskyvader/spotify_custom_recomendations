const { Op } = require("sequelize");
const { request } = require("../../utils");
const { Song } = require("../../database");
const { getSong, songIdFromURI } = require("../../model");

const { removeSongPlaylistCache } = require("../song/getPlaylistSongs");
const {
	removeSongRemoveRecommendedCache,
} = require("../song/myRemoveRecommended");

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

	removeSongPlaylistCache(playlistId, currentSong);
	removeSongRemoveRecommendedCache(playlistId, currentSong);

	const deletedSong = await getSong(session, songIdFromURI(songuri));
	deletedSong.removed = true;
	deletedSong.song_removed = Date.now();
	await Song.update(deletedSong, {
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
