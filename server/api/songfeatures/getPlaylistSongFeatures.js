const { getPlaylistSongs } = require("../song");

const getPlaylistSongFeatures = async (playlist) => {
	const songlist = await getPlaylistSongs(playlist);

	const songFeatures = await songlist.map(async (song) => {
		const features = await song.getSongFeatures();
		return features[0];
	});
	return songFeatures;
};

module.exports = { getPlaylistSongFeatures };
