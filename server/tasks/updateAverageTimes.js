const { Playlist } = require("../database");
const { myRecentSongs } = require("../api/song/myRecentSongs");

const updateAverageTimes = async (user) => {
	const response = { error: false, message: [] };
	const fakesession = {
		hash: user.hash,
		access_token: user.access_token,
		refresh_token: user.refresh_token,
	};

	return response;
};

module.exports = { updateAverageTimes };
