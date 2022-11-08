import GetRequest from "./Request";

export const Playlist = async (playlistid) => {
	const url = `/api/playlist/${playlistid}`;
	return GetRequest(url);
};

export const PlaylistRecommended = async (playlistid) => {
	const url = `/api/playlist/${playlistid}/recommended`;
	return GetRequest(url);
};

export const PlaylistDeleteRecommended = async (playlistid) => {
	const url = `/api/playlist/${playlistid}/deleterecommended`;
	return GetRequest(url);
};

export const LastPlayed = async () => {
	const url = "/api/lastplayed";
	return GetRequest(url);
};

export const DeleteSong = async (playlistid, songuri) => {
	const url = `/api/playlist/${playlistid}/remove/${songuri}`;
	return GetRequest(url, "POST");
};

export const AddSong = async (playlistid, songuri) => {
	const url = `/api/playlist/${playlistid}/add/${songuri}`;
	return GetRequest(url, "POST");
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
	const url = `/api/playlist/${playlistid}/deletedsongs`;
	return GetRequest(url);
};

export const SongFeatures = async (playlistid) => {
	const url = `/api/playlist/${playlistid}/songfeatures`;
	return GetRequest(url);
};
export const SingleSongFeatures = async (playlistid, songid) => {
	const url = `/api/playlist/${playlistid}/songfeatures/${songid}`;
	return GetRequest(url);
};
