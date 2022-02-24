import { useState, useContext } from "react";
import { Container } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useParams, Redirect } from "react-router-dom";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import { SessionContext } from "../context/SessionContextProvider";
import PlayListSongs from "../modules/playlist/PlayListSongs";
import RecommendedSongs from "../modules/playlist/RecommendedSongs";
import RecommendedDeleteSongs from "../modules/playlist/RecommendedDeleteSongs";
import LastPlayedSongs from "../modules/playlist/LastPlayedSongs";

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
				"calc(100vh - " +
				theme.mixins.toolbar.minHeight +
				"px - " +
				theme.spacing(7) +
				" )",
			height: "100vh",
			overflow: "auto",
			// [theme.breakpoints.up("md")]: {
			// 	maxHeight:
			// 		"calc(50vh - " +
			// 		theme.mixins.toolbar.minHeight +
			// 		"px - " +
			// 		theme.spacing() +
			// 		" )",
			// },
		};
	});
	if (LoggedIn) {
		return (
			<Container maxWidth={false}>
				<Tabs
					value={tabNumber}
					onChange={handleChangeTab}
					aria-label="basic tabs example"
				>
					<Tab label="Songs" />
					<Tab label="Recommended" />
					<Tab label="Delete" />
					<Tab label="Last Played" />
				</Tabs>
				<Root role="tabpanel" hidden={tabNumber !== 0}>
					<PlayListSongs
						playlistId={playlistid}
						hidden={tabNumber !== 0}
					/>
				</Root>
				<Root role="tabpanel" hidden={tabNumber !== 1}>
					<RecommendedSongs
						playlistId={playlistid}
						hidden={tabNumber !== 1}
					/>
				</Root>
				<Root role="tabpanel" hidden={tabNumber !== 2}>
					<RecommendedDeleteSongs
						playlistId={playlistid}
						hidden={tabNumber !== 2}
					/>
				</Root>
				<Root role="tabpanel" hidden={tabNumber !== 3}>
					<LastPlayedSongs hidden={tabNumber !== 3} />
				</Root>
			</Container>
		);
	}
	return null;
};

export default Playlists;
