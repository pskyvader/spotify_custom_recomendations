// import { useEffect } from "react";
import Playlists from "../../components/playlist/Playlists";
import Login, { is_logged } from "../../modules/LoginButton";
import PlaylistContextProvider from "../../modules/PlaylistContextProvider";

const Home = () => {
	return is_logged() ? (
		<PlaylistContextProvider>
			<Playlists />
		</PlaylistContextProvider>
	) : (
		<Login />
	);
};
export default Home;
