import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

import Login from "./Login";

const login = () => {
	const expiration = localStorage.getItem("expiration");
	const access_token = localStorage.getItem("access_token");
	if (access_token !== null && expiration > Date.now()) {
		return null;
	} else {
		return <Login />;
	}
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
