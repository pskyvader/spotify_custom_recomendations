import { useContext, useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { Avatar, Button, CircularProgress } from "@mui/material";

import Login, { Logout, is_logged } from "../../modules/LoginButton";
import { ProfileContext } from "../../context/ProfileContextProvider";

const UserInfo = () => {
	// const [user, setUser] = useState(null);
	const { profile } = useContext(ProfileContext);
	console.log("header",profile)

	useEffect(() => {
		console.log("header",profile)
	}, [profile]);

	if (!profile) return null;
	return (
		<Box sx={{ display: "flex" }}>
			<Avatar sx={{ mr: 2 }} alt={profile.name} src={profile.image} />
			<Button variant="contained" onClick={Logout}>
				Logout
			</Button>
		</Box>
	);
};

const Header = () => {
	const [header, setHeader] = useState(<CircularProgress />);

	useEffect(() => {
		is_logged().then((loggedin) => {
			if (loggedin) {
				setHeader(<UserInfo />);
				return;
			}
			setHeader(<Login />);
		});
	}, []);

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
						{header}
					</Toolbar>
				</AppBar>
			</Box>
		</header>
	);
};

export default Header;
