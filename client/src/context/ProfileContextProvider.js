import { createContext, useMemo, useState, useContext, useEffect } from "react";
import { useCookies } from "react-cookie";
import { Me } from "../API";
import { SessionContext } from "./SessionContextProvider";

export const ProfileContext = createContext({});

const ProfileContextProvider = (props) => {
	const [cookies, setCookie] = useCookies(["keep_logged", "access_token"]);
	const { LoggedIn } = useContext(SessionContext);
	const [profile, setProfile] = useState(null);
	const provider = useMemo(() => ({ profile, setProfile }), [profile]);

	useEffect(() => {
		if (LoggedIn && profile === null) {
			Me.Me().then((response) => {
				if (response.error) {
					console.error(response);
					// alert(JSON.stringify(response));
					return false;
				}

				if (
					cookies.keep_logged &&
					response.access_token !== cookies.access_token
				) {
					setCookie("access_token", response.access_token);
				}
				if (
					cookies.keep_logged &&
					response.refresh_token !== cookies.refresh_token
				) {
					setCookie("refresh_token", response.refresh_token);
				}
				setProfile(response);
			});
		}
	}, [LoggedIn, cookies, setCookie, profile, setProfile]);

	return (
		<ProfileContext.Provider value={provider}>
			{props.children}
		</ProfileContext.Provider>
	);
};

export default ProfileContextProvider;
