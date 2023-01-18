const { request } = require("../");
const { formatSongGroup } = require("../song");

const getSongs = async (access_token, playlist) => {
	if (!playlist.active) {
		return { error: true, message: "Playlist not active" };
	}

	let url = `https://api.spotify.com/v1/playlists/${playlist.id}/tracks`;
	let items = [];
	while (url) {
		const response = await request(access_token, url);
		if (response.error) {
			return response;
		}
		url = response.next;
		items.push(...response.items);
	}
	return formatSongGroup(items.map((item) => item.track));
};

module.exports = { getSongs };
