import { useState, useContext } from "react";
import { Grid, Container } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useParams, Redirect } from "react-router-dom";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import { SessionContext } from "../context/SessionContextProvider";
import PlayListSongs from "../modules/playlist/PlayListSongs";
import RecommendedSongs from "../modules/playlist/RecommendedSongs";
import RecommendedDeleteSongs from "../modules/playlist/RecommendedDeleteSongs";

const Playlists = () => {
	const { playlistid } = useParams() || null;
	const { LoggedIn } = useContext(SessionContext);

	const [tabNumber, setTabNumber] = useState(0);

	const handleChangeTab = (event, newValue) => {
		setTabNumber(newValue);
	};

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
					<Tabs
						value={tabNumber}
						onChange={handleChangeTab}
						aria-label="basic tabs example"
					>
						<Tab label="Item One" />
						<Tab label="Item Two" />
						<Tab label="Item Three" />
					</Tabs>
					<div role="tabpanel" hidden={tabNumber !== 0}>
						<PlayListSongs playlistId={playlistid} />
					</div>

					{/* <Grid item xs={12} md={8}>
						<Root>
							<PlayListSongs playlistId={playlistid} />
						</Root>
					</Grid> */}
					{/* <Grid item xs={12} md={6}>
						<Root>
							<TopSongs />
						</Root>
					</Grid> */}
					{/* <Grid item xs={12} md={6}>
						<Root>
							<RecommendedSongs playlistId={playlistid} />
						</Root>
					</Grid>
					<Grid item xs={12} md={6}>
						<Root>
							<RecommendedDeleteSongs playlistId={playlistid} />
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
