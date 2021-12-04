import { PlaylistContext } from "../context/PlaylistContextProvider";
import { useContext } from "react";
export const FormatPlaylists = (playlists, MyId) => {
	const { playlistId } = useContext(PlaylistContext);

	let itemList = [];
	let selectedId = playlistId;
	playlists.forEach((currentPlaylist) => {
		const formattedPlaylist = {};
		formattedPlaylist.id = currentPlaylist.id;
		formattedPlaylist.disabled = MyId !== currentPlaylist.owner.id;
		formattedPlaylist.selected = false;
		formattedPlaylist.name = currentPlaylist.name;
		formattedPlaylist.image = currentPlaylist.images[0]
			? currentPlaylist.images[0].url
			: null;

		if ( (selectedId === currentPlaylist.id) && MyId === currentPlaylist.owner.id ) {
			formattedPlaylist.selected = true;
			selectedId = currentPlaylist.id;
		}
		itemList.push(formattedPlaylist);
	});
	return { itemList, selectedId };
};
