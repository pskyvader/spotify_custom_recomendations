import { Button } from "@mui/material";

import { Credentials } from "../../API";


import { generateRandomString } from "../../utils";

export const is_logged = () => {
	const expiration = localStorage.getItem("expiration");
	const access_token = localStorage.getItem("access_token");
	return access_token !== null && expiration > Date.now();
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

	// your application requests authorization
	var scope =
		"user-read-private user-top-read user-read-email playlist-modify-public playlist-modify-private";
	var uri =
		"https://accounts.spotify.com/authorize?" +
		new URLSearchParams({
			response_type: "token",
			client_id: Credentials.client_id,
			scope: scope,
			redirect_uri: Credentials.redirect_uri,
			state: state,
		});

	return (
		<Button variant="contained" href={uri} color="inherit">
			Login with Spotify
		</Button>
	);
};

export default Login;
