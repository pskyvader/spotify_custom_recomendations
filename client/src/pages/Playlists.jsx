import { useContext } from "react";
import { Grid, Container } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useParams, Redirect } from "react-router-dom";

import { SessionContext } from "../context/SessionContextProvider";
import PlayListSongs from "../components/playlist/PlayListSongs";
import RecommendedSongs from "../components/playlist/RecommendedSongs";
import RemoveSongs from "../components/playlist/RemoveSongs";

const Playlists = () => {
	const { playlistid } = useParams() || null;

	const { LoggedIn } = useContext(SessionContext);

	if (LoggedIn === false) {
		return <Redirect to="/" />;
	}

	const Root = styled("div")(({ theme }) => {
		return {
			maxHeight:
				"calc(33vh - " +
				theme.mixins.toolbar.minHeight +
				"px - " +
				theme.spacing() +
				" )",
			height: "100vh",
			overflow: "auto",
			[theme.breakpoints.up("md")]: {
				maxHeight:
					"calc(50vh - " +
					theme.mixins.toolbar.minHeight +
					"px - " +
					theme.spacing() +
					" )",
			},
		};
	});
	if (LoggedIn) {
		return (
			<Container maxWidth={false}>
				<Grid container spacing={2}>
					<Grid item xs={12} md={8}>
						<Root>
							<PlayListSongs playlistId={playlistid} />
						</Root>
					</Grid>
					{/* <Grid item xs={12} md={6}>
						<Root>
							<TopSongs />
						</Root>
					</Grid> */}
					<Grid item xs={12} md={6}>
						<Root>
							<RecommendedSongs playlistId={playlistid} />
						</Root>
					</Grid>
					{/* <Grid item xs={12} md={6}>
						<Root>
							<RemoveSongs playlistId={playlistid} />
						</Root>
					</Grid> */}
					{/* <Grid item xs={12} md={6}>
					<Root>
						<NoTopSongs />
					</Root>
				</Grid> */}
				</Grid>
			</Container>
		);
	}
	return null;
};

export default Playlists;
