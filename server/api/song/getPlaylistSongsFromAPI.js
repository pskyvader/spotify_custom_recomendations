const { formatSongAPIList } = require("../../utils");
const { request } = require("../../spotifyapi/");
const getPlaylistSongsFromAPI = async (user, playlist) => {
	if (!playlist.active) {
		return { error: true, message: "Playlist not active" };
	}

	let url = `https://api.spotify.com/v1/playlists/${playlist.id}/tracks`;
	let items = [];
	while (url) {
		const response = await request(user.access_token, url);
		if (response.error) {
			return response;
		}
		url = response.next;
		items.push(...response.items);
	}
	return formatSongAPIList(items);
};

module.exports = { getPlaylistSongsFromAPI };
