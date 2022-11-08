const { request, formatSongFeaturesAPIList } = require("../../utils");

const getSongFeaturesFromApi = async (user, songList) => {
	if (songlist.length > 100) {
		return {
			error: true,
			message: `max songs allowed 100, current list is ${songList.length}`,
		};
	}
	let url = `https://api.spotify.com/v1/audio-features`;

	const ids = songList.reduce(
		(previous, song) => previous + `${song.id},`,
		"?ids="
	);
	const response = await request(user.access_token, url + ids);
	if (response.error) {
		return response;
	}
	return formatSongFeaturesAPIList(response);
};

module.exports = { getSongFeaturesFromApi };
