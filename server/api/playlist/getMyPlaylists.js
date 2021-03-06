const { request } = require("../../utils");
const { getUser } = require("../../model");
let myPlaylistResult = {};
let lastGetResult = null;

const getMyPlaylists = async (session) => {
	const access_token = session.access_token;
	const currentUser = await getUser(session);
	if (currentUser.error) {
		return currentUser;
	}

	if (
		myPlaylistResult[access_token] &&
		lastGetResult > Date.now() - 3600000
	) {
		return myPlaylistResult[access_token];
	}
	let url = "https://api.spotify.com/v1/me/playlists?limit=50";

	let playlists = [];
	while (url) {
		const response = await request(access_token, url);
		if (response.error) {
			console.log(response);
			return response;
		}
		url = response.next;
		playlists.push(...response.items);
	}

	myPlaylistResult[access_token] = playlists.map((currentPlaylist) => {
		const formattedPlaylist = {};
		formattedPlaylist.id = currentPlaylist.id;
		formattedPlaylist.disabled =
			currentUser.id !== currentPlaylist.owner.id;
		formattedPlaylist.selected = false;
		formattedPlaylist.name = currentPlaylist.name;
		formattedPlaylist.image = currentPlaylist.images[0]
			? currentPlaylist.images[0].url
			: null;
		return formattedPlaylist;
	});
	lastGetResult = Date.now();
	return myPlaylistResult[access_token];
};

module.exports = { getMyPlaylists };
