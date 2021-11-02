import Playlists from "./Playlists";
import Login from "./Login";

export default function Home(params) {
	const expiration = localStorage.getItem("expiration");
	const access_token = localStorage.getItem("access_token");
	if (access_token !== null && expiration > Date.now()) {
		return <Playlists></Playlists>;
	} else {
		return <Login></Login>
	}
}
