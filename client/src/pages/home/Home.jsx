import { useState, useEffect } from "react";
import { CircularProgress } from "@mui/material";

import Playlists from "../../components/playlist/Playlists";
import Login, { is_logged } from "../../modules/LoginButton";
import PlaylistContextProvider from "../../modules/PlaylistContextProvider";
import ProfileContextProvider from "../../modules/ProfileContextProvider";

const Home = () => {
	const [home, setHome] = useState(<CircularProgress />);
	useEffect(() => {
		is_logged().then((loggedin) => {
			if (loggedin) {
				setHome(
					<ProfileContextProvider>
						<PlaylistContextProvider>
							<Playlists />
						</PlaylistContextProvider>
					</ProfileContextProvider>
				);
				return;
			}
			setHome(<Login />);
		});
	}, []);

	return home;
};
export default Home;
