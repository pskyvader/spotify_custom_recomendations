const formatPlaylist = (rawData, active = null) => {
	return {
		id: rawData.id,
		name: rawData.name,
		active: active,
		image: ((rawData.images && rawData.images[0]) && rawData.images[0].url) || null,
		UserId: rawData.owner.id,
	};
};

const formatPlaylistGroup = (rawGroup) => {
	return rawGroup.map((currentPlaylist) => {
		return formatPlaylist(currentPlaylist);
	});
};

module.exports = { formatPlaylist, formatPlaylistGroup };
