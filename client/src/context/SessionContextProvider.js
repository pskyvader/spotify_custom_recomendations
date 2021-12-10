import {
	createContext,
	useState,
	useLayoutEffect,
} from "react";
import { Me } from "../API";

export const SessionContext = createContext({});

const SessionContextProvider = (props) => {
	const [LoggedIn, setLoggedIn] = useState(null);
	const provider = {
		LoggedIn: LoggedIn,
		setLoggedIn: setLoggedIn,
	};
	
	// console.log("session provider")

	useLayoutEffect(() => {
		// console.log("SessionContext")
		Me.LoggedIn().then((response) => {
			// console.log(response);
			if (response.error) return false;
			if (response.loggedin !== LoggedIn) {
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
