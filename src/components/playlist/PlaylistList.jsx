import { useContext } from "react";
import { Box } from "@mui/system";
import {
	List,
	ListItemButton,
	ListItemIcon,
	ListItemText,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import PlaylistContext from "../../modules/PlaylistContext";

const PlaylistList = ({ playlists, me }) => {
	const { playlistId, setPlaylistId } = useContext(PlaylistContext);
	console.log(playlistId,setPlaylistId)

	let itemList = [];
	playlists.forEach((currentPlaylist) => {
		if (
			(playlistId === currentPlaylist.id || playlistId === 0) &&
			(me.id === currentPlaylist.owner.id || currentPlaylist.colaborative)
		) {
			setPlaylistId(currentPlaylist.id);
		}
		itemList.push(
			<ListItemButton
				disabled={
					me.id !== currentPlaylist.owner.id &&
					!currentPlaylist.colaborative
				}
				key={currentPlaylist.id}
				selected={playlistId === currentPlaylist.id}
				onClick={() => {
					setPlaylistId(currentPlaylist.id);
				}}
			>
				<ListItemIcon>
					<Avatar
						alt={currentPlaylist.name}
						src={currentPlaylist.images[2].url}
					/>
				</ListItemIcon>
				<ListItemText primary={currentPlaylist.name} />
			</ListItemButton>
		);
	});

	return (
		<Box sx={{ height: "100%", flexGrow: 12 }}>
			<List component="nav" aria-label="playlists">
				{itemList}
			</List>
		</Box>
	);
};

export default PlaylistList;
