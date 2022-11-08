const { request, formatSongFeaturesAPIList } = require("../../utils");

const getSongFeaturesFromAPI = async (user, songList) => {
	let url = `https://api.spotify.com/v1/audio-features`;

	const finalresponse = [];
	while (songList.length > 0) {
		const currentlist = songList.splice(0, 100);
		const ids = currentlist.reduce(
			(previous, song) => previous + `${song.id},`,
			"?ids="
		);
		const response = await request(user.access_token, url + ids);
		if (response.error) {
			return response;
		}
		finalresponse.push(formatSongFeaturesAPIList(response));
	}

	return finalresponse;
};

module.exports = { getSongFeaturesFromAPI };
