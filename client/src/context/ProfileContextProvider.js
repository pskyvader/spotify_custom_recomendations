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
		if (LoggedIn) {
			Me.Me().then((response) => {
				if (response.error) {
					console.error(response);
					return false;
				}
				if (
					cookies.keep_logged &&
					response.access_token !== cookies.access_token
				) {
					setCookie("access_token", response.access_token);
				}
				setProfile(response);
			});
		}
		return null;
	}, [LoggedIn,cookies, setCookie]);

	return (
		<ProfileContext.Provider value={provider}>
			{props.children}
		</ProfileContext.Provider>
	);
};

export default ProfileContextProvider;
