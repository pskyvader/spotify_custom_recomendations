export const FormatPlaylists = (playlists, currentPlaylistid, MyId) => {
	let itemList = [];
	let selectedId = null;
	playlists.forEach((currentPlaylist) => {
		const formattedPlaylist = {};
		formattedPlaylist.id = currentPlaylist.id;
		formattedPlaylist.disabled = MyId !== currentPlaylist.owner.id;
		formattedPlaylist.selected = false;
		formattedPlaylist.name = currentPlaylist.name;
		formattedPlaylist.image = currentPlaylist.images[0]
			? currentPlaylist.images[0].url
			: null;

		if (
			(currentPlaylistid === currentPlaylist.id ||
				currentPlaylistid === null) &&
			MyId === currentPlaylist.owner.id
		) {
			formattedPlaylist.selected = true;
			selectedId = currentPlaylist.id;
		}
		itemList.push(formattedPlaylist);
	});
	return { itemList, selectedId };
};
