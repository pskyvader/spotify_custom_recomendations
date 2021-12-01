import { Button } from "@mui/material";
import { useEffect } from "react";
import GetRequest from "../API/Request";

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

const LoginButton = () => {
	const uri = "login";
	useEffect(() => {
		console.log(window.sessionStorage.getItem("loggedin"));
		GetRequest("/api").then((response) => {
			console.log(response);
		});
	});

	return (
		<Button variant="contained" href={uri} color="inherit">
			Login with Spotify
		</Button>
	);
};

export default LoginButton;
