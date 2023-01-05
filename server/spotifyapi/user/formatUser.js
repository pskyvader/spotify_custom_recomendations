const formatPlaylist = (rawData, active = false) => {
	return {
		id: rawData.id,
		name: rawData.name,
		active: active,
		image: (rawData.images[0] && rawData.images[0].url) || null,
		UserId: rawData.owner.id,
	};
};

module.exports = { formatPlaylist };
