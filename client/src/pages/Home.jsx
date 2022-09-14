import { useContext, useMemo, Fragment, useEffect } from "react";
import { CircularProgress, Container, Grid, Paper } from "@mui/material";

import LoginButton from "../components/LoginButton";
import { SessionContext } from "../context/SessionContextProvider";
import { genres } from "../utils";

const InitialText = ({ LoggedIn, setDrawer }) => {
	const styles = useMemo(() => {
		const styleList = [];
		for (let index = 0; index < 5; index++) {
			let genre = genres[Math.floor(Math.random() * genres.length)];
			genre = genre.replace("-", " ");
			genre = genre[0].toUpperCase() + genre.substring(1);
			styleList.push(genre);
		}
		return styleList;
	}, []);

	useEffect(() => {
		if (LoggedIn) {
			setTimeout(() => {
				setDrawer(true);
			}, 1000);
		}
	}, [LoggedIn, setDrawer]);

	if (LoggedIn) {
		return (
			<Grid item p={2} style={{ textAlign: "left" }}>
				Select a playlist from the menu
			</Grid>
		);
	}

	return (
		<Fragment>
			<Grid item p={2} style={{ textAlign: "left" }}>
				<div style={{ textAlign: "center" }}>
					<p>
						<i> Custom Playlists </i> is created for people who
						enjoy discover new music, even if it is in a completely
						different style that you are used to.
					</p>
					<p>
						You use to listen <b> {styles[1]}</b>? you may also like{" "}
						<b> {styles[2]}</b>.
					</p>
					<p>
						Do you enjoy <b> {styles[3]}</b>, maybe{" "}
						<b> {styles[4]}</b> is your new love
					</p>
					<p>The possibilities are infinite!</p>
				</div>
				You can customize anything you want for a given playlist,
				including:
				<ul>
					<li>How far you want to explore styles unknown to you</li>
					<li>
						How often you want to get new songs in your playlist
					</li>
					<li>How many new songs you want to get every day</li>
					<li>And much more...</li>
				</ul>
			</Grid>
			<Grid item p={2}>
				<LoginButton />
			</Grid>
		</Fragment>
	);
};

const Home = (props) => {
	const { LoggedIn } = useContext(SessionContext);

	if (LoggedIn === null) {
		return <CircularProgress />;
	}

	return (
		<Container maxWidth="sm">
			<Grid my={4}>
				<Paper>
					<Grid
						container
						p={2}
						direction="column"
						alignItems="center"
					>
						<InitialText LoggedIn={LoggedIn} {...props} />
					</Grid>
				</Paper>
			</Grid>
		</Container>
	);
};
export default Home;
