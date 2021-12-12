import { Grid, Container } from "@mui/material";
import { styled } from "@mui/material/styles";


import PlaylistList from "../components/playlist/actions/PlaylistList";
import PlayListSongs from "../components/playlist/actions/PlayListSongs";
import AddSongs from "../components/playlist/actions/AddSongs";
import RemoveSongs from "../components/playlist/actions/RemoveSongs";

const Playlists = () => {
	const Root = styled("div")(({ theme }) => {
		return {
			maxHeight: "calc(33vh - " + theme.mixins.toolbar.minHeight + "px - " + theme.spacing() + " )",
			height: "100vh",
			overflow: "auto",
			[theme.breakpoints.up("md")]: {
				maxHeight: "calc(50vh - " + theme.mixins.toolbar.minHeight + "px - " + theme.spacing() + " )",
			},
		};
	});
	return (
		<Container maxWidth={false}>
			<Grid container spacing={2}>
				<Grid item xs={12} md={4}>
					<Root>
						<PlaylistList />
					</Root>
				</Grid>
				<Grid item xs={12} md={8}>
					<Root>
						<PlayListSongs />
					</Root>
				</Grid>
				{/* <Grid item xs={12} md={6}>
					<Root>
						<TopSongs />
					</Root>
				</Grid> */}
				<Grid item xs={12} md={6}>
					<Root>
						<AddSongs />
					</Root>
				</Grid>
				<Grid item xs={12} md={6}>
					<Root>
						<RemoveSongs />
					</Root>
				</Grid>
				{/* <Grid item xs={12} md={6}>
					<Root>
						<NoTopSongs />
					</Root>
				</Grid> */}
			</Grid>
		</Container>
	);
};


export default Playlists;
