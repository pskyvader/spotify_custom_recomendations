import {
	Drawer,
	Box,
	ListItemButton,
	ListItemIcon,
	ListItemText,
} from "@mui/material";

import { useContext } from "react";
import Avatar from "@mui/material/Avatar";
import { useHistory, useParams } from "react-router-dom";

import { PlaylistContext } from "../context/PlaylistContextProvider";
import { ProfileContext } from "../context/ProfileContextProvider";

const DrawerItems = () => {
	const { playlists } = useContext(PlaylistContext);
	const { profile } = useContext(ProfileContext);
	let history = useHistory();
	const { playlistid } = useParams();
	console.log(playlists);

	if (!profile) return "Profile Error";
	if (!playlists) return "Playlists Error";
	if (!profile || !playlists) return null;

	return playlists.map((currentPlaylist) => {
		return (
			<ListItemButton
				// disabled={!currentPlaylist.active}
				key={currentPlaylist.id}
				selected={playlistid === currentPlaylist.id}
				onClick={() => history.push("/playlist/" + currentPlaylist.id)}
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

const DrawerList = (props) => (
	<Box
		sx={{ width: 300 }}
		role="presentation"
		onClick={props.toggleDrawer(false)}
		onKeyDown={props.toggleDrawer(false)}
	>
		<DrawerItems />
	</Box>
);

const MainDrawer = (props) => {
	return (
		<Drawer
			anchor="left"
			open={props.drawer}
			onClose={props.toggleDrawer(false)}
		>
			<DrawerList {...props} />
		</Drawer>
	);
};

export default MainDrawer;
