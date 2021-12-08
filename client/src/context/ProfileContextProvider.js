import { createContext, useMemo, useState, useContext } from "react";
import { Me } from "../API";
import { SessionContext } from "./SessionContextProvider";

export const ProfileContext = createContext({});

const ProfileContextProvider = (props) => {
	const { LoggedIn } = useContext(SessionContext);
	const [profile, setProfile] = useState(null);
	const provider = useMemo(() => ({ profile, setProfile }), [profile]);

	useMemo(() => {
		if (LoggedIn) {
			return Me.Me().then((response) => {
				if (response.error) return false;
				setProfile(response);
			});
		}
		return false;
	}, [LoggedIn]);

	return (
		<ProfileContext.Provider value={provider}>
			{props.children}
		</ProfileContext.Provider>
	);
};

export default ProfileContextProvider;
