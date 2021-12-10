import {
	createContext,
	useState,
	useLayoutEffect,
} from "react";
import { Me } from "../API";

export const SessionContext = createContext({});

const SessionContextProvider = (props) => {
	const [LoggedIn, setLoggedIn] = useState(false);
	const provider = {
		LoggedIn: LoggedIn,
		setLoggedIn: setLoggedIn,
	};

	useLayoutEffect(() => {
		Me.LoggedIn().then((response) => {
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
