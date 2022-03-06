import { useState, useContext, useEffect } from "react";
import { Container, CircularProgress } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useParams, Redirect } from "react-router-dom";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import { SessionContext } from "../context/SessionContextProvider";
import { PlaylistContext } from "../context/PlaylistContextProvider";
import PlayListSongs from "../modules/playlist/PlayListSongs";
import RecommendedSongs from "../modules/playlist/RecommendedSongs";
import RecommendedDeleteSongs from "../modules/playlist/RecommendedDeleteSongs";
import LastPlayedSongs from "../modules/playlist/LastPlayedSongs";
import { Playlist } from "../API";

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
	};
});
const Playlists = () => {
	const { playlistId } = useParams() || null;
	const { LoggedIn } = useContext(SessionContext);
	const { playlistActive, setPlaylistActive } = useContext(PlaylistContext);
	const [tabNumber, setTabNumber] = useState(0);

	useEffect(() => {
		if (!playlistActive[playlistId]) {
			Playlist.PlaylistStatus(playlistId).then((response) => {
				if (response.error) return console.log(response);
				playlistActive[playlistId] = response;
				setPlaylistActive({ ...playlistActive });
			});
		}
	}, [playlistId, playlistActive, setPlaylistActive]);

	const handleChangeTab = (event, newValue) => {
		setTabNumber(newValue);
	};

	if (LoggedIn === false) {
		return <Redirect to="/" />;
	}

	if (LoggedIn) {
		if (!playlistActive[playlistId]) {
			return <CircularProgress />;
		}
		if (!playlistActive[playlistId].active) {
			return <div>This Playlist is not active</div>;
		}
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
						playlistId={playlistId}
						hidden={tabNumber !== 0}
					/>
				</Root>
				<Root role="tabpanel" hidden={tabNumber !== 1}>
					<RecommendedSongs
						playlistId={playlistId}
						hidden={tabNumber !== 1}
					/>
				</Root>
				<Root role="tabpanel" hidden={tabNumber !== 2}>
					<RecommendedDeleteSongs
						playlistId={playlistId}
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
