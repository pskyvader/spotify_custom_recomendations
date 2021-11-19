import { useState, useEffect } from "react";
import { Box } from "@mui/system";
import { List, CircularProgress } from "@mui/material";

import { Me } from "../../../API";
import { FormatPlaylists } from "../../../modules/FormatPlaylists";
import { PlaylistTemplate } from "../../../modules/PlaylistView";

const PlaylistListTemplate = ({ playlists, me }) => {
	let templateProps = FormatPlaylists(playlists, me.id);
	return (
		<Box sx={{ height: "100%", flexGrow: 12 }}>
			<List component="nav" aria-label="playlists">
				<PlaylistTemplate {...templateProps} />
			</List>
		</Box>
	);
};

const PlaylistList = () => {
	const [playlist, setPlaylist] = useState(<CircularProgress />);

	useEffect(() => {
		setPlaylist(<CircularProgress />);

		Me.MePlaylist().then((response) => {
			if (response.items.length === 0) {
				setPlaylist("No available Playlist");
				return;
			}
			Me.Me().then((me) => {
				setPlaylist(
					<PlaylistListTemplate playlists={response.items} me={me} />
				);
			});
		});
	}, []);

	return playlist;
};

export default PlaylistList;
