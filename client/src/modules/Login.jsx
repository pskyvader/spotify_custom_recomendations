import { Button } from "@mui/material";

import { Credentials } from "../API";

import { generateRandomString } from "../utils";

export const is_logged = () => {
	return (
		localStorage.getItem("access_token") !== null &&
		localStorage.getItem("expiration") > Date.now()
	);
};

export const Logout = () => {
	localStorage.clear();
	window.location = "/";
};

const Login = () => {
	let state = localStorage.getItem(Credentials.stateKey);
	if (state === null) {
		state = generateRandomString(16);
		localStorage.setItem(Credentials.stateKey, state);
	}

	// // your application requests authorization
	// const permissions = [
	// 	// "user-read-private",
	// 	"user-top-read",
	// 	"user-read-recently-played",
	// 	// "user-read-email",
	// 	// "playlist-read-collaborative",
	// 	"playlist-read-private",
	// 	"playlist-modify-public",
	// 	"playlist-modify-private",
	// ];
	// var scope = permissions.join(" ");
	// var uri =
	// 	"https://accounts.spotify.com/authorize?" +
	// 	new URLSearchParams({
	// 		response_type: "token",
	// 		client_id: Credentials.client_id,
	// 		scope: scope,
	// 		redirect_uri: Credentials.redirect_uri,
	// 		state: state,
	// 	});

	const uri ="login";

	return (
		<Button variant="contained" href={uri} color="inherit">
			Login with Spotify
		</Button>
	);
};

export default Login;
