const { SongFeatures } = require("../database");
const { formatSongFeaturesAPI } = require("../utils");
const { request } = require("../spotifyapi/");

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

	const newSongFeatures = await SongFeatures.findByPk(data.id)
		.then((features) => {
			if (features === null) {
				return SongFeatures.create(data);
			}
			return SongFeatures.update(data, { where: { id: features.id } });
		})
		.catch((err) => {
			console.error("create song features error", data, err);
			return { error: true, message: err.message };
		});

	return newSongFeatures;
};

const getSongFeatures = async (access_token, songFeaturesId, data = null) => {
	const currentSongFeatures = await SongFeatures.findOne({
		where: { id: songFeaturesId, SongId: songFeaturesId },
	});
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
