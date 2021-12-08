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
			<Container  maxWidth="sm">
				<Grid container p={2} direction="column" alignItems="center" >
					<Grid item p={2} style={{textAlign:"left"}}>
						<i> Custom Playlists </i> is created for people who enjoy discover new music, even if it is in a completely different style.
						<br />
						You can customize anything you want for a given playlist, including:
						<ul>
							<li>How far you want to explore styles unknown to you</li>
							<li>How often you want to get new songs in your playlist</li>
							<li>How many new songs you want to get every day</li>
							<li>And much more...</li>
						</ul>

					</Grid>
					<Grid item>
						<LoginButton />
					</Grid>
				</Grid>
			</Container>
		);
	}, [LoggedIn]);

	return home;
};
export default Home;
