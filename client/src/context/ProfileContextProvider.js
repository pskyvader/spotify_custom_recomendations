// import { useEffect } from "react";
import { createContext, useMemo, useState } from "react";
import { Me } from "../API";

export const ProfileContext = createContext({});

const ProfileContextProvider = (props) => {
	const [profile, setProfile] = useState(null);
	const provider = useMemo( () => ({ profile, setProfile }), [profile] );

	useMemo(() => {
		return Me.Me().then((response) => {
			if (response.error) return false;
			setProfile(response);
		});
	}, []);

	return (
		<ProfileContext.Provider value={provider}>
			{props.children}
		</ProfileContext.Provider>
	);
};

export default ProfileContextProvider;
