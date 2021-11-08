import { useEffect, useState } from "react";
import { CircularProgress, Grid, Container } from "@mui/material";
import { createTheme } from '@mui/material/styles';

import Me, { MePlaylist } from "./API/Me";
import PlaylistList from "./PlaylistList";
import PlaylistDetail from "./PlaylistDetail";

const PlaylistsTemplate = ({response, me}) => {
	const theme = createTheme();
	const [selectedItem,SetselectedItem]=useState(null);
	return (
		// <Container>
			<Grid container spacing={2} style={ {height: "calc(100vh - " + theme.mixins.toolbar.minHeight + "px)"}}>
				<Grid item xs={{boxSizing:12,height:"50%"}} sm={12} md={4}>
					<PlaylistList items={response.items} me={me} SetselectedItem={SetselectedItem}/>
				</Grid>
				<Grid item xs={12} sm={12} md={8}>
					<PlaylistDetail id={selectedItem}/>
				</Grid>
			</Grid>
		// </Container>
	);
};

const Playlists = () => {
	const [playlist, setPlaylist] = useState(<CircularProgress />);

	useEffect(() => {
		MePlaylist().then((response) => {
			Me().then((me) => {
				setPlaylist(<PlaylistsTemplate response={response} me={me}/>);
			});
		});
	}, []);

	return playlist;
};

export default Playlists;
