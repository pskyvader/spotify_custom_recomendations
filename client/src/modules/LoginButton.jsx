import { Button } from "@mui/material";
import GetRequest from "../API/Request";

export const is_logged = () => {
	return GetRequest("/api/loggedin").then((response) => {
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
