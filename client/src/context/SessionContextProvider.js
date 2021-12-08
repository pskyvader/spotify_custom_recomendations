import { createContext, useMemo, useState,useEffect } from "react";
import { Me } from "../API";

export const SessionContext = createContext({});

const SessionContextProvider = (props) => {
	const [LoggedIn, setLoggedIn] = useState(false);
	const provider = useMemo(
		() => ({
			LoggedIn: LoggedIn,
			setLoggedIn: setLoggedIn,
		}),
		[LoggedIn]
	);
	useEffect(() => {
		Me.LoggedIn().then((response) => {
			console.log("session", response,LoggedIn);
			if (response.error) return false;
			if (response.loggedin !== LoggedIn) {
                console.log("set loggedin",response.loggedin)
				setLoggedIn(response.loggedin);
			}
		});
	}, [LoggedIn]);

	return (
		<SessionContext.Provider value={provider}>
			{props.children}
		</SessionContext.Provider>
	);
};

export default SessionContextProvider;
