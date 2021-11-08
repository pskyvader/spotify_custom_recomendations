import { useEffect, useState } from "react";
import { CircularProgress, Grid } from "@mui/material";

import Me, { MePlaylist } from "./API/Me";
import PlaylistList from "./PlaylistList";
import PlaylistDetail from "./PlaylistDetail";

const PlaylistsTemplate = ({ response, me }) => {
	const [selectedItem, SetselectedItem] = useState(null);
	return (
		<Grid
			container
			spacing={2}
		>
			<Grid item xs={12} md={4}>
				<PlaylistList
					items={response.items}
					me={me}
					SetselectedItem={SetselectedItem}
				/>
			</Grid>
			<Grid item xs={12} md={8}>
				<PlaylistDetail id={selectedItem} />
			</Grid>
		</Grid>
	);
};

const Playlists = () => {
	const [playlist, setPlaylist] = useState(<CircularProgress />);

	useEffect(() => {
		MePlaylist().then((response) => {
			Me().then((me) => {
				setPlaylist(<PlaylistsTemplate response={response} me={me} />);
			});
		});
	}, []);

	return playlist;
};

export default Playlists;
