import { useContext, useEffect } from "react";
import { Box } from "@mui/system";
import {
	List,
	ListItemButton,
	ListItemIcon,
	ListItemText,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";

import { PlaylistContext } from "../../../context/PlaylistContextProvider";
import { ProfileContext } from "../../../context/ProfileContextProvider";

const PlaylistTemplate = () => {
	const { playlistId, setPlaylistId, playlists } = useContext(PlaylistContext);
	const { profile } = useContext(ProfileContext);
	let selectedId = playlistId;

	useEffect(() => {
		if (playlistId !== selectedId) {
			setPlaylistId(selectedId);
		}
	}, [playlistId, setPlaylistId, selectedId]);

	if (!profile || !playlists) return null;
	return playlists.map((currentPlaylist) => {
		if ( playlistId === currentPlaylist.id && !currentPlaylist.disabled) {
			currentPlaylist.selected = true;
			selectedId = currentPlaylist.id;
		}

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

const PlaylistList = () => {
	return (
		<Box sx={{ height: "100%", flexGrow: 12 }}>
			<List component="nav" aria-label="playlists">
				<PlaylistTemplate />
			</List>
		</Box>
	);
};

export default PlaylistList;
