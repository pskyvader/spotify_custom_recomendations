const { request } = require("../../utils");
const { updatePlaylistSong } = require("../../model");

const removeSongFromPlaylistFromAPI = async (user, song, playlist) => {
	const url =
		"https://api.spotify.com/v1/playlists/" + playlist.id + "/tracks";

	const songs = {
		tracks: [{ uri: `spotify:track:${song.id}` }],
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
		active: false,
		removed_date: Date.now(),
	};
	const deletedSong = await updatePlaylistSong(
		playlist.id,
		song.id,
		deleteData
	);
	if (deletedSong.error) {
		return deletedSong;
	}
	return {
		message: "success",
		snapshot_id: response.snapshot_id,
		song: song.toJSON(),
	};
};

module.exports = { removeSongFromPlaylistFromAPI };
