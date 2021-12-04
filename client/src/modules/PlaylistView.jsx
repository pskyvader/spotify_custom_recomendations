import { useContext, useEffect } from "react";
import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import Avatar from "@mui/material/Avatar";

import { PlaylistContext } from "../context/PlaylistContextProvider";

export const PlaylistTemplate = ({ itemList, selectedId }) => {
	const { playlistId, setPlaylistId } = useContext(PlaylistContext);

	useEffect(() => {
		if (playlistId !== selectedId) {
			setPlaylistId(selectedId);
		}
	}, [playlistId,setPlaylistId, selectedId]);

	return itemList.map((currentPlaylist) => {
		return (
			<ListItemButton
				disabled={currentPlaylist.disabled}
				key={currentPlaylist.id}
				selected={currentPlaylist.selected}
				onClick={() => {
					setPlaylistId(currentPlaylist.id);
				}}
			>
				<ListItemIcon>
					<Avatar
						alt={currentPlaylist.name}
						src={currentPlaylist.image}
					/>
				</ListItemIcon>
				<ListItemText primary={currentPlaylist.name} />
			</ListItemButton>
		);
	});
};
