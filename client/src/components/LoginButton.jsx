import { useContext } from "react";
import { Button, FormControlLabel, Checkbox } from "@mui/material";
import { useCookies } from "react-cookie";
import { Me } from "../API";

import { SessionContext } from "../context/SessionContextProvider";

export const Logout = () => {
	const cookiefunctions = useCookies();
	const removeCookie = cookiefunctions[2];
	const { setLoggedIn } = useContext(SessionContext);

	removeCookie("keep_logged");
	removeCookie("access_token");
	removeCookie("refresh_token");
	removeCookie("hash");
	Me.LogOut();
	setLoggedIn(false);
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
