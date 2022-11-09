const { SongFeatures } = require("../database");
const { request, formatSongFeaturesAPI } = require("../utils");

const createSongFeatures = async (
	access_token,
	songFeaturesId,
	data = null
) => {
	if (data === null) {
		let url = `https://api.spotify.com/v1/audio-features/${songFeaturesId}`;
		const response = await request(access_token, url);
		if (response.error) {
			return response;
		}
		data = formatSongFeaturesAPI(response);
	}
	SongFeatures.describe().then(({ features }) => {
		console.log("Song Features attributes", (features));
	});

	const [newSongFeatures] = await SongFeatures.upsert(data).catch((err) => {
		console.error("create song features error", data, err);
		return { error: true, message: err.message };
	});

	return newSongFeatures;
};

const getSongFeatures = async (access_token, songFeaturesId, data = null) => {
	console.log("get song features", access_token, songFeaturesId, data);
	const currentSongFeatures = await SongFeatures.findOne({
		where: { id: songFeaturesId, SongId: songFeaturesId },
	});
	console.log("current song features", currentSongFeatures);
	if (currentSongFeatures !== null) {
		return currentSongFeatures;
	}
	return createSongFeatures(access_token, songFeaturesId, data);
};

const deleteSongFeatures = async (songFeaturesId) => {
	const currentSongFeatures = await SongFeatures.findByPk(songFeaturesId);
	if (currentSongFeatures === null) {
		return true;
	}

	const songFeaturesDestroyed = await currentSongFeatures
		.destroy()
		.catch((err) => ({ error: err.message }));

	if (songFeaturesDestroyed.error) {
		return songFeaturesDestroyed;
	}
	return true;
};

module.exports = { getSongFeatures, deleteSongFeatures };
