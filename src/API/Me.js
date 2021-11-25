import GetRequest from "./Request";

export const Me = () => {
	const url = "https://api.spotify.com/v1/me";
	return GetRequest(url);
};

export const MePlaylist = (offset = 0) => {
	const url =
		"https://api.spotify.com/v1/me/playlists?limit=50&offset=" + offset;
	return GetRequest(url);
};

export const MeTop = (offset = 0, time_range = "long_term") => {
	const url =
		"https://api.spotify.com/v1/me/top/tracks?limit=50&offset=" +
		offset +
		"&time_range=" +
		time_range;
	return GetRequest(url);
};
