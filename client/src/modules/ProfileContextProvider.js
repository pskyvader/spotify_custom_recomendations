import { useEffect } from "react";
import { createContext, useMemo, useState } from "react";
import { Me } from "../API";

export const ProfileContext = createContext({});

const ProfileContextProvider = (props) => {
	const [Profile, setProfile] = useState(null);
	const provider = useMemo(() => ({ Profile, setProfile }), [Profile]);

	const getMe = useMemo(async () => {
		const response = await Me.Me();
		if (response.error) return;
		setProfile(response);
	}, []);

	useEffect(() => {
		getMe();
	}, [getMe]);

	return (
		<ProfileContext.Provider value={provider}>
			{props.children}
		</ProfileContext.Provider>
	);
};

export default ProfileContextProvider;
