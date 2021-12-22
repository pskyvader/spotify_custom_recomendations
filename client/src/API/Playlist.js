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
	const url = "/api/actions/delete/" + playlistid + "/" + songuri;
	return GetRequest(url);
};

export const AddSong = async (playlistid, songuri) => {
	const url = "/api/actions/add/" + playlistid + "/" + songuri;
	return GetRequest(url);
};
