import { createContext, useMemo, useState, useContext, useEffect } from "react";
import { useCookies } from "react-cookie";
import { Me } from "../API";
import { SessionContext } from "./SessionContextProvider";

export const ProfileContext = createContext({});

const ProfileContextProvider = (props) => {
	const [cookies, setCookie] = useCookies(["keep_logged", "access_token","expiration"]);
	const { LoggedIn } = useContext(SessionContext);
	const [profile, setProfile] = useState(null);
	const provider = useMemo(() => ({ profile, setProfile }), [profile]);

	useEffect(() => {
		if (LoggedIn) {
			Me.Me().then((response) => {
				if (response.error) {
					console.error(response);
					alert(JSON.stringify(response));
					return false;
				}
				if (cookies.keep_logged) {
					if (response.access_token !== cookies.access_token) {
						setCookie("access_token", response.access_token);
					}
					if (response.refresh_token !== cookies.refresh_token) {
						setCookie("refresh_token", response.refresh_token);
					}
					if (response.expiration !== cookies.expiration) {
						setCookie("expiration", response.expiration);
					}
				}
				console.log("Profile context",response);
				setProfile(response);
			});
		}
		return null;
	}, [LoggedIn, cookies, setCookie]);

	return (
		<ProfileContext.Provider value={provider}>
			{props.children}
		</ProfileContext.Provider>
	);
};

export default ProfileContextProvider;
