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

export const LastPlayed = async () => {
	const url = "/api/playlists/lastplayed";
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

export const ActivatePlaylist = async (playlistid) => {
	const url = `/api/playlist/${playlistid}/activate`;
	return GetRequest(url);
};

export const DeactivatePlaylist = async (playlistid) => {
	const url = `/api/playlist/${playlistid}/deactivate`;
	return GetRequest(url);
};
export const PlaylistStatus = async (playlistid) => {
	const url = `/api/playlist/${playlistid}/status`;
	return GetRequest(url);
};

export const DeletedSongs = async (playlistid) => {
	const url = `/api/playlists/deletedsongs/${playlistid}`;
	return GetRequest(url);
};
