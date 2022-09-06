const { request } = require("../../utils");
const { getPlaylist } = require("../../model");

const getPlaylistsFromAPI = async (user) => {
	let url = "https://api.spotify.com/v1/me/playlists?limit=50";
	let playlists = [];
	while (url) {
		const response = await request(user.access_token, url);
		if (response.error) {
			console.log(response);
			return response;
		}
		url = response.next;
		playlists.push(...response.items);
	}

	const filtered = playlists.filter(
		(currentPlaylist) => user.id === currentPlaylist.owner.id
	);

	const playlistsId = filtered.map((currentPlaylist) => {
		return getPlaylist(currentPlaylist.id);
	});
	return Promise.all(playlistsId);
};

module.exports = { getPlaylistsFromAPI };
