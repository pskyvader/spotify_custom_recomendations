import { Button, FormControlLabel, Checkbox } from "@mui/material";
import { useCookies } from "react-cookie";

export const Logout = () => {
	localStorage.clear();
	window.location = "/";
};

const KeepLogged = (signed, setCookie) => {
	setCookie("keep_logged", signed);
};

const LoginButton = () => {
	const [cookies, setCookie] = useCookies(["keep_logged"]);
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
					control={<Checkbox checked={JSON.parse(cookies["keep_logged"])} />}
					label="Keep me signed in"
					onChange={(e, signed) => KeepLogged(signed, setCookie)}
				/>
			</div>
		</div>
	);
};

export default LoginButton;
