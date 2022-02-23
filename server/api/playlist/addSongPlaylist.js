const { request } = require("../../utils");
const { getSong, songIdFromURI } = require("../../model");
const { addSongPlaylistCache } = require("../song/getPlaylistSongs");
const { removeSongRecommendedCache } = require("../song/myRecommendedSongs");
const {
	removeSongRemoveRecommendedCache,
} = require("../song/myRemoveRecommended");

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

	const currentSong = await getSong(session, songIdFromURI(songuri));
	addSongPlaylistCache(playlistId, currentSong);
	removeSongRecommendedCache(playlistId, currentSong);
	removeSongRemoveRecommendedCache(playlistId, currentSong);

	return {
		message: "success",
		snapshot_id: response.snapshot_id,
	};
};

module.exports = { addSongPlaylist };
