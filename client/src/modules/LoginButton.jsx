import { Button } from "@mui/material";

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
