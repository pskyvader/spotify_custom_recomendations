import GetRequest from "./Request";

export const Playlist = async (playlistid) => {
	const url = "/api/playlists/get/" + playlistid;
	return GetRequest(url);
};

export const PlaylistRecommended = async (playlistid) => {
	const url = "/api/playlists/recommended/" + playlistid;
	return GetRequest(url);
};

export const PlaylistDeleteRecommended = async (playlistid) => {
	const url = "/api/playlists/deleterecommended/" + playlistid;
	return GetRequest(url);
};

export const DeleteSong = async (playlistid, songuri) => {
	const url = "/api/actions/remove/" + playlistid + "/" + songuri;
	return GetRequest(url);
};

export const AddSong = async (playlistid, songuri) => {
	const url = "/api/actions/add/" + playlistid + "/" + songuri;
	return GetRequest(url);
};
