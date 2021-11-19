import { useEffect, useContext } from "react";
import { Box } from "@mui/system";
import {
	List,
	ListItemButton,
	ListItemIcon,
	ListItemText,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { PlaylistContext } from "../../modules/PlaylistContextProvider";

const PlaylistList = ({ playlists, me }) => {
	const { playlistId, setPlaylistId } = useContext(PlaylistContext);

	let itemList = [];
	let currentPlaylistid = playlistId;
	playlists.forEach((currentPlaylist) => {
		if (
			(playlistId === currentPlaylist.id || currentPlaylistid === null) &&
			me.id === currentPlaylist.owner.id
		) {
			currentPlaylistid = currentPlaylist.id;
		}
		itemList.push(
			<ListItemButton
				disabled={me.id !== currentPlaylist.owner.id}
				key={currentPlaylist.id}
				selected={playlistId === currentPlaylist.id}
				onClick={() => {
					setPlaylistId(currentPlaylist.id);
				}}
			>
				<ListItemIcon>
					<Avatar
						alt={currentPlaylist.name}
						src={
							currentPlaylist.images[0]
								? currentPlaylist.images[0].url
								: null
						}
					/>
				</ListItemIcon>
				<ListItemText primary={currentPlaylist.name} />
			</ListItemButton>
		);
	});

	useEffect(() => {
		setPlaylistId(currentPlaylistid);
	}, [setPlaylistId, currentPlaylistid]);

	return (
		<Box sx={{ height: "100%", flexGrow: 12 }}>
			<List component="nav" aria-label="playlists">
				{itemList}
			</List>
		</Box>
	);
};

export default PlaylistList;
