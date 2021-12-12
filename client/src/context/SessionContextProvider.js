import { createContext, useState, useLayoutEffect } from "react";
import { Me } from "../API";

export const SessionContext = createContext({});

const SessionContextProvider = (props) => {
	const [LoggedIn, setLoggedIn] = useState(null);
	const provider = {
		LoggedIn: LoggedIn,
		setLoggedIn: setLoggedIn,
	};

	useLayoutEffect(() => {
		if (LoggedIn === null) {
			Me.LoggedIn().then((response) => {
				if (response.error) return false;
				if (response.loggedin !== LoggedIn) {
					setLoggedIn(response.loggedin);
				}
			});
		}
	}, [LoggedIn]);

	return (
		<SessionContext.Provider value={provider}>
			{props.children}
		</SessionContext.Provider>
	);
};

export default SessionContextProvider;
