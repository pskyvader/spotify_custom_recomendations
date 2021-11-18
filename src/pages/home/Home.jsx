import Playlists from "../../components/playlist/Playlists";
import Login, { is_logged } from "../../modules/Login";


const Home = () => (is_logged ? <Playlists /> : <Login />);
export default Home;
