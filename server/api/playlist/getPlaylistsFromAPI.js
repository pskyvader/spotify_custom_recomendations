const { request } = require("../../utils");
const { getPlaylist } = require("../../model");

const getPlaylistsFromAPI = async (user) => {
	let url = "https://api.spotify.com/v1/me/playlists?limit=50";
	let playlists = [];
	while (url) {
		const response = await request(user.access_token, url);
		if (response.error) {
			console.log("Get playlist from API error", response);
			return response;
		}
		url = response.next;
		playlists.push(...response.items);
	}

	const filtered = playlists.filter((currentPlaylist) => {
		// console.log(currentPlaylist, currentPlaylist.owner,user.id);
		return parseInt(user.id) === parseInt(currentPlaylist.owner.id);
	});

	const playlistsPromises = filtered.map((currentPlaylist) => {
		return getPlaylist(user, currentPlaylist.id);
	});
	// console.log(playlists, filtered, playlistsPromises);
	return Promise.all(playlistsPromises).then(
		(responsePromises) => responsePromises
	);
};

module.exports = { getPlaylistsFromAPI };
