import { useContext, useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { Avatar, Button, CircularProgress } from "@mui/material";

import LoginButton, { Logout } from "../components/LoginButton";
import { ProfileContext } from "../context/ProfileContextProvider";
import { SessionContext } from "../context/SessionContextProvider";
import MainDrawer from "./MainDrawer";

const UserInfo = () => {
	const { profile } = useContext(ProfileContext);
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
	const { LoggedIn } = useContext(SessionContext);
	const [header, setHeader] = useState(<CircularProgress />);
	const [drawer, setDrawer] = useState(false);

	useEffect(() => {
		if (LoggedIn) {
			setHeader(<UserInfo />);
			return;
		}
		setHeader(<LoginButton />);
	}, [LoggedIn]);

	const toggleDrawer = (open) => (event) => {
		if (
			event.type === "keydown" &&
			(event.key === "Tab" || event.key === "Shift")
		) {
			return;
		}

		setDrawer(open || !drawer);
	};

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
							onclick={toggleDrawer}
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
			{LoggedIn ? (
				<MainDrawer drawer={drawer} toggleDrawer={toggleDrawer} />
			) : null}
		</header>
	);
};

export default Header;
