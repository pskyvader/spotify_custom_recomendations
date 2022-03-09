import { useState, useContext, useEffect } from "react";
import { Container, CircularProgress, Switch } from "@mui/material";
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

		[theme.breakpoints.down("md")]: {
			maxHeight: "none",
		},
		minHeight: 400,
		height: "100vh",
		overflow: "auto",
	};
});
const Playlists = () => {
	const { playlistid } = useParams() || null;
	const { LoggedIn } = useContext(SessionContext);
	const { playlistActive, setPlaylistActive } = useContext(PlaylistContext);
	const [tabNumber, setTabNumber] = useState(0);

	useEffect(() => {
		if (!playlistActive[playlistid]) {
			Playlist.PlaylistStatus(playlistid).then((response) => {
				if (response.error) return console.log(response);
				playlistActive[playlistid] = response;
				setPlaylistActive({ ...playlistActive });
			});
		}
	}, [playlistid, playlistActive, setPlaylistActive]);

	const handleChange = (event) => {
		playlistActive[playlistid].active = event.target.checked;

		const currentFunction = event.target.checked
			? Playlist.ActivatePlaylist
			: Playlist.DeactivatePlaylist;

		currentFunction(playlistid).then((response) => {
			if (response.error) return console.log(response);
			playlistActive[playlistid] = response;
			setPlaylistActive({ ...playlistActive });
		});
	};
	const handleChangeTab = (event, newValue) => {
		setTabNumber(newValue);
	};

	if (LoggedIn === false) {
		return <Redirect to="/" />;
	}

	if (LoggedIn) {
		if (!playlistActive[playlistid]) {
			return <CircularProgress />;
		}
		if (!playlistActive[playlistid].active) {
			return (
				<div>
					Playlist inactive
					<Switch
						checked={playlistActive[playlistid].active}
						onChange={handleChange}
						inputProps={{ "aria-label": "controlled" }}
					/>
				</div>
			);
		}
		return (
			<Container maxWidth={false}>
				Playlist Active
				<Switch
					checked={playlistActive[playlistid].active}
					onChange={handleChange}
					inputProps={{ "aria-label": "controlled" }}
				/>
				<Tabs
					value={tabNumber}
					onChange={handleChangeTab}
					aria-label="basic tabs example"
					variant="scrollable"
					scrollButtons="auto"
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
