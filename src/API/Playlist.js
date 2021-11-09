import GetRequest from "./Request";

export const Playlist = async (id) => {
	const url = "https://api.spotify.com/v1/playlists/" + id;
	return GetRequest(url);
};

export const DeleteSong = async (playlistid, songuri) => {
    console.log(playlistid,songuri,e)
	const url =
		"https://api.spotify.com/v1/playlists/" + playlistid + "/tracks";

	const songs = {
		tracks: [
			{ uri: "spotify:track:4iV5W9uYEdYUVa79Axb7Rh" },
		],
	};
    return console.log("delete",playlistid,songuri);
	// return GetRequest(url, "DELETE");
};

export default Playlist;
