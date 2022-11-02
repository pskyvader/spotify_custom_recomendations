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
					return false;
				}

				if (cookies.keep_logged && response.hash !== cookies.hash) {
					setCookie("hash", response.hash);
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
