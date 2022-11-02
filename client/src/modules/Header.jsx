import {
	useContext,
	useState,
	Fragment,
	Children,
	cloneElement,
	isValidElement,
} from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { Avatar, Button } from "@mui/material";
import { useCookies } from "react-cookie";

import LoginButton, { Logout } from "../components/LoginButton";
import { ProfileContext } from "../context/ProfileContextProvider";
import { SessionContext } from "../context/SessionContextProvider";
import MainDrawer from "./MainDrawer";

const UserInfo = () => {
	const cookiefunctions = useCookies();
	const removeCookie = cookiefunctions[2];
	const { profile } = useContext(ProfileContext);
	const { setLoggedIn } = useContext(SessionContext);
	if (!profile) return null;
	return (
		<Box sx={{ display: "flex" }}>
			<Avatar sx={{ mr: 2 }} alt={profile.name} src={profile.image} />
			<Button
				variant="contained"
				onClick={() => Logout(removeCookie, setLoggedIn)}
			>
				Logout
			</Button>
		</Box>
	);
};

const Header = (props) => {
	const { LoggedIn } = useContext(SessionContext);
	const [drawer, setDrawer] = useState(false);

	const toggleDrawer = (open) => (event) => {
		if (
			event.type === "keydown" &&
			(event.key === "Tab" || event.key === "Shift")
		) {
			return;
		}

		setDrawer(open || !drawer);
	};

	const childrenWithProps = Children.map(props.children, (child) => {
		// Checking isValidElement is the safe way and avoids a TS error too.
		if (isValidElement(child)) {
			return cloneElement(child, { setDrawer });
		}

		return child;
	});

	let headerButton = null;
	if (LoggedIn === true) {
		headerButton = <UserInfo />;
	}
	if (LoggedIn === false) {
		headerButton = <LoginButton />;
	}

	return (
		<Fragment>
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
								onClick={toggleDrawer()}
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
							{headerButton}
						</Toolbar>
					</AppBar>
				</Box>
				{LoggedIn ? (
					<MainDrawer drawer={drawer} toggleDrawer={toggleDrawer} />
				) : null}
			</header>
			{childrenWithProps}
		</Fragment>
	);
};

export default Header;
