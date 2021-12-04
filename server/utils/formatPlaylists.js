const FormatPlaylists = (playlists, MyId) => {
	let itemList = playlists.map((currentPlaylist) =>{
		const formattedPlaylist = {};
		formattedPlaylist.id = currentPlaylist.id;
		formattedPlaylist.disabled = MyId !== currentPlaylist.owner.id;
		formattedPlaylist.selected = false;
		formattedPlaylist.name = currentPlaylist.name;
		formattedPlaylist.image = currentPlaylist.images[0]
			? currentPlaylist.images[0].url
			: null;
		return formattedPlaylist;

	});
	return itemList;
};

module.exports = { FormatPlaylists };