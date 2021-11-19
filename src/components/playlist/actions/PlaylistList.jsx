import { useState, useEffect, useContext } from "react";
import { Box } from "@mui/system";
import { List, CircularProgress } from "@mui/material";

import { PlaylistContext } from "../../../modules/PlaylistContextProvider";
import { Me } from "../../../API";
import { FormatPlaylists } from "../../../modules/FormatPlaylists";
import { PlaylistTemplate } from "../../../modules/PlaylistView";

const PlaylistListTemplate = ({ playlists, me }) => {
	const { playlistId, setPlaylistId } = useContext(PlaylistContext);

	let { itemList, selectedId } = FormatPlaylists( playlists, playlistId, me.id );

	useEffect(() => {
		setPlaylistId(selectedId);
	}, [setPlaylistId, selectedId]);

	return (
		<Box sx={{ height: "100%", flexGrow: 12 }}>
			<List component="nav" aria-label="playlists">
				<PlaylistTemplate data={itemList} />
			</List>
		</Box>
	);
};

const PlaylistList = () => {
	const [playlist, setPlaylist] = useState(<CircularProgress />);

	useEffect(() => {
		Me.MePlaylist().then((playlists) => {
			Me.Me().then((me) => {
				setPlaylist(
					<PlaylistListTemplate playlists={playlists.items} me={me} />
				);
			});
		});
	}, []);

	return playlist;
};

export default PlaylistList;
