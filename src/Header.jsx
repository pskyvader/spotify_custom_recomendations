import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { Avatar } from "@mui/material";

import Login from "./Login";
import { useEffect, useState } from "react";

const login = () => {
	const expiration = localStorage.getItem("expiration");
	const access_token = localStorage.getItem("access_token");
	if (access_token !== null && expiration > Date.now()) {
		return <UserInfo access_token={access_token} />;
	} else {
		return <Login />;
	}
};

const UserInfo = ({ access_token }) => {
	const [user, setUser] = useState(null);

	const userinfo_template = (response) => {
		return (
			<Avatar alt={response.display_name} src={response.images[0].url} />
		);
	};

	//useEffect(() => {
		// POST request using fetch inside useEffect React hook
		const requestOptions = {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + access_token,
			},
		};
		fetch("https://api.spotify.com/v1/me", requestOptions)
			.then((response) => response.json())
			.then((response) => {
				setUser(userinfo_template(response));
			});
	//}, [access_token]);

	return user;
};

const Header = () => {
	return (
		<header>
			<Box sx={{ flexGrow: 1 }}>
				<AppBar position="static">
					<Toolbar>
						<IconButton
							size="large"
							edge="start"
							color="inherit"
							aria-label="menu"
							sx={{ mr: 2 }}
						>
							<MenuIcon />
						</IconButton>
						<Typography
							variant="h6"
							component="div"
							sx={{ flexGrow: 1 }}
						>
							Spotify custom playlists
						</Typography>
						{login()}
					</Toolbar>
				</AppBar>
			</Box>
		</header>
	);
};

export default Header;
