const { request } = require("../../spotifyapi/");

const addSongToPlaylistFromAPI = async (user, playlist, song) => {
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
	return {
		message: "success",
		snapshot_id: response.snapshot_id,
		song: song.toJSON(),
	};
};

module.exports = { addSongToPlaylistFromAPI };
