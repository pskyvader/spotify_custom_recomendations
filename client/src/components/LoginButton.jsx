import { Button, FormControlLabel, Checkbox } from "@mui/material";
import { useCookies } from "react-cookie";
import { Me } from "../API";

export const Logout = (setCookie, setLoggedIn) => {
	setCookie("keep_logged", false);
	Me.LogOut().then(() => {
		// console.log("logout");
		// setCookie("access_token", null);
		// setCookie("refresh_token", null);
		// localStorage.clear();
		setLoggedIn(false);
		// window.location = "/";
	});
};

const KeepLogged = (signed, setCookie) => {
	setCookie("keep_logged", signed);
};

const LoginButton = () => {
	const [cookies, setCookie] = useCookies(["keep_logged"]);
	const keepLogged = cookies.keep_logged || false;

	const uri = "login";
	return (
		<div>
			<div>
				<Button
					variant="contained"
					href={uri}
					sx={{ backgroundColor: "#1DB954" }}
				>
					Login with Spotify
				</Button>
			</div>
			<div>
				<FormControlLabel
					control={<Checkbox checked={JSON.parse(keepLogged)} />}
					label="Keep me signed in"
					onChange={(e, signed) => KeepLogged(signed, setCookie)}
				/>
			</div>
		</div>
	);
};

export default LoginButton;
