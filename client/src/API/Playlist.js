import GetRequest from "./Request";

export const Playlist = async (playlistid) => {
	const url = "/api/playlists/" + playlistid;
	return GetRequest(url);
};

export const PlaylistReccomended = async (playlistid) => {
	const url = "/api/playlists/recommended/" + playlistid;
	return GetRequest(url);
};

export const DeleteSong = async (playlistid, songuri) => {
	const url =
		"/api/playlists/" + playlistid + "/tracks";

	const songs = {
		tracks: [{ uri: songuri }],
	};
	return GetRequest(url, "DELETE", JSON.stringify(songs));
};

export const AddSong = async (playlistid, songuri) => {
	const url =
		"/api/playlists/" + playlistid + "/tracks";

	const songs = {
		uris: [songuri],
		position: 0,
	};

	return GetRequest(url, "POST", JSON.stringify(songs));
};
