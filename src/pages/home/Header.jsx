import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { Avatar, Button } from "@mui/material";

import Login, { Logout, is_logged } from "../../components/login/Login";
import { useEffect, useState } from "react";

import Me from "../../API/Me";

const UserInfo = () => {
	const [user, setUser] = useState(null);

	const userinfo_template = (response) => {
		return (
			<Box sx={{ display: 'flex'}}>
				<Avatar sx={{ mr: 2 }} alt={response.display_name} src={response.images[0].url} />
				<Button variant="contained" onClick={Logout}> Logout </Button>
			</Box>
		);
	};
	useEffect(() => {
		Me().then((response) => {
			setUser(userinfo_template(response));
		});
	}, []);

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
						{is_logged() ? <UserInfo /> : <Login />}
					</Toolbar>
				</AppBar>
			</Box>
		</header>
	);
};

export default Header;
