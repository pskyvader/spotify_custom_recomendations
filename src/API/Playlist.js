import GetRequest from "./Request";

export const Playlist = async (id) => {
	const url = "https://api.spotify.com/v1/playlists/" + id;
	return GetRequest(url);
};

export const DeleteSong = async (playlistid, songuri) => {
	const url = "https://api.spotify.com/v1/playlists/" + playlistid + "/tracks";

	const songs = {
		tracks: [
			{ uri: songuri },
		],
	};
	return GetRequest(url, "DELETE",JSON.stringify(songs));
};
