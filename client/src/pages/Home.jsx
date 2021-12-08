import { useState, useEffect, useContext, useMemo } from "react";
import { CircularProgress, Container, Box, Grid } from "@mui/material";

import Playlists from "../components/playlist/Playlists";
import LoginButton from "../modules/LoginButton";
import { SessionContext } from "../context/SessionContextProvider";
import { genres } from "../utils";

const Home = () => {
	const { LoggedIn } = useContext(SessionContext);
	const [home, setHome] = useState(<CircularProgress />);
	const styles = useMemo(() => {
		const styleList = [];
		for (let index = 0; index < 5; index++) {
			let genre = genres[Math.floor(Math.random() * genres.length)];
			genre = genre[0].toUpperCase() + genre.substring(1);
			genre = genre.replace("-", " ");
			styleList.push(genre);
		}
		return styleList;
	}, []);

	useEffect(() => {
		if (LoggedIn) {
			setHome(<Playlists />);
			return;
		}
		setHome(
			<Container maxWidth="sm">
				<Grid container p={2} direction="column" alignItems="center">
					<Grid item p={2} style={{ textAlign: "left" }}>
						<div style={{ textAlign: "center" }}>
							<i> Custom Playlists </i> is created for people who
							enjoy discover new music, even if it is in a
							completely different style that you are used to.
							<br />
							<br />
							You use to listen <b> {styles[1]}</b>? you may also
							like <b> {styles[2]}</b>.
							<br />
							<br />
							Do you enjoy <b> {styles[3]}</b>, maybe{" "}
							<b> {styles[4]}</b> is your new love
							<br />
							<br />
							The possibilities are infinite!
						</div>
						<br />
						<br />
						You can customize anything you want for a given
						playlist, including:
						<ul>
							<li>
								How far you want to explore styles unknown to
								you
							</li>
							<li>
								How often you want to get new songs in your
								playlist
							</li>
							<li>
								How many new songs you want to get every day
							</li>
							<li>And much more...</li>
						</ul>
					</Grid>
					<Grid item>
						<LoginButton />
					</Grid>
				</Grid>
			</Container>
		);
	}, [LoggedIn, styles]);

	return home;
};
export default Home;
