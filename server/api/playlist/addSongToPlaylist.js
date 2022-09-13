const { request } = require("../../utils");
const { getPlaylistSong } = require("../../model");

const addSongToPlaylist = async (user, song, playlist) => {
	const url =
		"https://api.spotify.com/v1/playlists/" + playlist.id + "/tracks";
	const songs = { uris: [`spotify:track:${song.id}`], position: 0 };

	const response = await request(
		user.access_token,
		url,
		"POST",
		JSON.stringify(songs)
	);

	if (response.error) {
		return response;
	}
	const addedSong = await getPlaylistSong(playlist, song);
	if (addedSong.error) {
		return addedSong;
	}
	return {
		message: "success",
		snapshot_id: response.snapshot_id,
	};
};

module.exports = { addSongToPlaylist };
