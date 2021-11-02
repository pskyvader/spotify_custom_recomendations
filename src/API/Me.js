import GetRequest from "./Request";

const Me = async () => {
    const url="https://api.spotify.com/v1/me";
    return GetRequest(url);
}



export const MePlaylist = async (offset=0) => {
    const url="https://api.spotify.com/v1/me/playlists?limit=50&offset="+offset;
    return GetRequest(url);
}


export default Me;