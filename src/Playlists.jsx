import { useEffect, useState } from "react";
import { CircularProgress, Grid, Container } from "@mui/material";
import { createTheme, styled } from "@mui/material/styles";

import Me, { MePlaylist } from "./API/Me";
import PlaylistList from "./PlaylistList";
import PlaylistDetail from "./PlaylistDetail";

const PlaylistsTemplate = ({ response, me }) => {
	const Root = styled("div")(({ theme }) => ({
		maxHeight: "calc(50vh - " + theme.mixins.toolbar.minHeight + "px)",
		height: 5000,
		[theme.breakpoints.up("md")]: {
			maxHeight: "calc(100vh - " + theme.mixins.toolbar.minHeight + "px)",
		},
	}));

	const [selectedItem, SetselectedItem] = useState(null);
	return (
		<Container maxWidth={false}>
			<Grid container spacing={2}>
				<Grid item xs={12} sm={12} md={4}>
					<Root>
						<PlaylistList
							items={response.items}
							me={me}
							SetselectedItem={SetselectedItem}
						/>
					</Root>
				</Grid>
				<Grid item xs={12} md={8}>
					<Root>
						<PlaylistDetail id={selectedItem} />
					</Root>
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
				setPlaylist(<PlaylistsTemplate response={response} me={me} />);
			});
		});
	}, []);

	return playlist;
};

export default Playlists;
