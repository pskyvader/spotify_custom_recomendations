import { client_id, stateKey, redirect_uri } from "./Credentials";
import { generateRandomString } from "./Utils";
import Account from "./Account";
import { Redirect } from "react-router";

export default function Home(params) {
	const expiration = localStorage.getItem("expiration");
	const access_token = localStorage.getItem("access_token");
	if (access_token !== null && expiration > Date.now()) {
		return <Account></Account>;
	} else {
		return login();//<button onClick={login}> Login </button>;
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
	// window.location = uri;
	return <Redirect push  to={uri} />;
};
