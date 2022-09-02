const { request } = require("../../utils");
const { updatePlaylistSong } = require("../../model");

const removeSongFromPlaylist = async (user, song, playlist) => {
	const url =
		"https://api.spotify.com/v1/playlists/" + playlist.id + "/tracks";

	const songs = {
		tracks: [{ uri: song.uniqueid }],
	};

	const response = await request(
		user.access_token,
		url,
		"DELETE",
		JSON.stringify(songs)
	);
	if (response.error) {
		return response;
	}
	const deleteData = {
		removed: true,
		removed_date: Date.now(),
	};
	const deletedSong = await updatePlaylistSong(playlist, song, deleteData);
	if (deletedSong.error) {
		return deletedSong;
	}
	return {
		message: "success",
		snapshot_id: response.snapshot_id,
	};
};

module.exports = { removeSongFromPlaylist };
