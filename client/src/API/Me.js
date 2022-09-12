import GetRequest from "./Request";

export const LoggedIn = () => {
	const url = "/api/loggedin";
	return GetRequest(url);
};

export const LogOut = () => {
	const url = "/logout";
	return GetRequest(url);
};
export const LoginCookies = () => {
	const url = "/logincookie/";
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
