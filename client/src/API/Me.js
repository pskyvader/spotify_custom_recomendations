import GetRequest from "./Request";

export const LoggedIn = () => {
	const url = "/api/loggedin";
	return GetRequest(url);
};

export const LoginCookies = (access_token) => {
	const url = "/api/logincookie/" + access_token;
	return GetRequest(url);
};

export const Me = () => {
	const url = "/api/me";
	return GetRequest(url);
};

export const MePlaylist = () => {
	const url = "/api/me/playlists";
	return GetRequest(url);
};
