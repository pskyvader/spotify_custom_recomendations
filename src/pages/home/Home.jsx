import Playlists from "../../components/playlist/Playlists";
import Login, { is_logged } from "../../modules/Login";


export default (is_logged ? <Playlists /> : <Login />);
