import { useEffect } from "react";
import { createContext, useMemo, useState } from "react";
import { Me } from "../API";

export const ProfileContext = createContext({});

const ProfileContextProvider = (props) => {
	const [Profile, setProfile] = useState(null);
	const provider = useMemo(() => ({ Profile, setProfile }), [Profile]);

	const myprofile = useMemo(() => {
		return Me.Me().then((response) => response);
	}, []);

	useEffect(() => {
		myprofile.then((response) =>{
			console.log(response);
			if (response.error) return;
			setProfile(response);
		})
		
	}, [myprofile]);

	return (
		<ProfileContext.Provider value={provider}>
			{props.children}
		</ProfileContext.Provider>
	);
};

export default ProfileContextProvider;
