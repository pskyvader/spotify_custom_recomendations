import GetRequest from "./Request";


export const Playlist = async (id) => {
    const url = "https://api.spotify.com/v1/playlists/" + id;
    return GetRequest(url);
}


export default Playlist;