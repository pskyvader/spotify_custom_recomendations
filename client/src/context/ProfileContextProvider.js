import { useEffect } from "react";
import { createContext, useMemo, useState } from "react";
import { Me } from "../API";

export const ProfileContext = createContext({});

const ProfileContextProvider = (props) => {
	const [profile, setProfile] = useState(null);
	const provider = useMemo( () => ({ profile, setProfile }), [profile] );

	const myprofile = useMemo(() => {
		return Me.Me().then((response) => response);
	}, []);
	// useMemo(() => {
	// 	return Me.Me().then((response) => {
	// 		console.log("context",response)
	// 		if (response.error) return;
	// 		setProfile(response);
	// 	});
	// }, []);

	useEffect(() => {
		myprofile.then((response) => {
					console.log("context",response)
			if (response.error) return;
			setProfile(response);
		});
	}, [myprofile]);

	return (
		<ProfileContext.Provider value={provider}>
			{props.children}
		</ProfileContext.Provider>
	);
};

export default ProfileContextProvider;
