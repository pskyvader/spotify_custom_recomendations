import { useEffect, useState } from "react";
import { CircularProgress, Grid, Container } from "@mui/material";

import Me, { MePlaylist } from "./API/Me";
import PlaylistList from "./PlaylistList";
import PlaylistDetail from "./PlaylistDetail";

const Playlists_template = (response, me) => {
	
	const [selectedItem,SetselectedItem]=useState(0);


	return (
		<Container>
			<Grid container spacing={2}>
				<Grid item xs={4}>
					<PlaylistList items={response.items} me={me} SetselectedItem={SetselectedItem}/>
				</Grid>
				<Grid item xs={8}>
					<PlaylistDetail item={selectedItem}/>
				</Grid>
			</Grid>
		</Container>
	);
};

const Playlists = () => {
	const [playlist, setPlaylist] = useState(<CircularProgress />);

	useEffect(() => {
		MePlaylist().then((response) => {
			Me().then((me) => {
				setPlaylist(Playlists_template(response, me));
			});
		});
	}, []);

	return playlist;
};

export default Playlists;
