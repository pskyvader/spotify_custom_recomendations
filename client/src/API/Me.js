import GetRequest from "./Request";

export const LoggedIn = () => {
	const url = "/api/loggedin";
	return GetRequest(url);
};

export const Me = () => {
	const url = "/api/me";
	return GetRequest(url);
};

export const MePlaylist = (offset = 0) => {
	const url =
		"/api/me/playlists?limit=50&offset=" + offset;
	return GetRequest(url);
};

export const MeTop = (offset = 0, time_range = "long_term") => {
	const url =
		"/api/me/top/tracks?limit=50&offset=" +
		offset +
		"&time_range=" +
		time_range;
	return GetRequest(url);
};

export const MeRecently = (after = null, limit = 10) => {
	if (after === null) {
		after=Date.now()-604800000;//1 week in milliseconds = (24*60*60*1000) * 7; //7 days)
	}
	const url =
		"/api/me/player/recently-played?limit=" +
		limit +
		"&after=" +
		after;
	return GetRequest(url);
};
