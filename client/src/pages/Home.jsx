import { useState, useEffect, useContext } from "react";
import { CircularProgress, Container, Box, Grid } from "@mui/material";

import Playlists from "../components/playlist/Playlists";
import LoginButton from "../modules/LoginButton";
import { SessionContext } from "../context/SessionContextProvider";

const Home = () => {
	const { LoggedIn } = useContext(SessionContext);
	const [home, setHome] = useState(<CircularProgress />);
	useEffect(() => {
		if (LoggedIn) {
			setHome(<Playlists />);
			return;
		}
		setHome(
			<Grid sx={{ flexGrow: 0.5 }} container spacing={2}>
				<Grid item xs={6}>
					<LoginButton />
				</Grid>
			</Grid>
		);
	}, [LoggedIn]);

	return home;
};
export default Home;
