import { client_id, stateKey, redirect_uri } from "./Credentials";
import { generateRandomString } from "./Utils";
import Account from "./Account";
import Button from '@mui/material/Button';

export default function Home(params) {
	const expiration = localStorage.getItem("expiration");
	const access_token = localStorage.getItem("access_token");
	if (access_token !== null && expiration > Date.now()) {
		return <Account></Account>;
	} else {
		return <Button variant="contained" onClick={login}> Login with Spotify</Button>;
	}
}

var login = function () {
	var state = generateRandomString(16);
	localStorage.setItem(stateKey, state);
	// your application requests authorization
	var scope = "user-read-private user-read-email";
	var uri =
		"https://accounts.spotify.com/authorize?" +
		new URLSearchParams({
			response_type: "token",
			client_id: client_id,
			scope: scope,
			redirect_uri: redirect_uri,
			state: state,
		});
	window.location = uri;
};
