import Playlists from "../../components/playlist/Playlists";
import Login, { is_logged } from "../../modules/Login";
import PlaylistContext from "../../modules/PlaylistContext";

const Home = () =>
	is_logged ? (
		<PlaylistContext.Consumer>
			<Playlists />
		</PlaylistContext.Consumer>
	) : (
		<Login />
	);

export default Home;
