import { Button } from "@mui/material";
import { Me } from "../API";

export const is_logged = () => {
	return Me.LoggedIn().then((response) => {
		return response.loggedin;
	});
};

export const Logout = () => {
	localStorage.clear();
	window.location = "/";
};

const LoginButton = () => {
	const uri = "login";
	return (
		<Button variant="contained" href={uri} color="inherit">
			Login with Spotify
		</Button>
	);
};

export default LoginButton;
