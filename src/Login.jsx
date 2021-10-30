import { client_id, stateKey, redirect_uri } from "./Credentials";
import { generateRandomString } from "./Utils";
import { Button } from "@mui/material";

const Login = function () {
    let state = localStorage.getItem(stateKey)
    if(state===null){
        state = generateRandomString(16);
        localStorage.setItem(stateKey, state);
    }
	
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

	return (
		<Button variant="contained" href={uri} color="inherit">
			Login with Spotify
		</Button>
	);
};

export default Login;
