import { useState, useEffect, useContext, useMemo } from "react";
import { CircularProgress, Container, Grid } from "@mui/material";

import Playlists from "../components/playlist/Playlists";
import LoginButton from "../components/LoginButton";
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
	}, [LoggedIn, styles]);

	return home;
};
export default Home;
