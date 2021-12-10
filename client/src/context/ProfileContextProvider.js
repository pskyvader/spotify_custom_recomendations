import { createContext, useMemo, useState, useContext,useEffect } from "react";
import { Me } from "../API";
import { SessionContext } from "./SessionContextProvider";

export const ProfileContext = createContext({});

const ProfileContextProvider = (props) => {
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
				setProfile(response);
			});
		}
		return null;
	}, [LoggedIn]);

	return (
		<ProfileContext.Provider value={provider}>
			{props.children}
		</ProfileContext.Provider>
	);
};

export default ProfileContextProvider;
