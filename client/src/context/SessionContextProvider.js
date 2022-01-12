import { createContext, useState, useLayoutEffect } from "react";
import { useCookies } from "react-cookie";
import { Me } from "../API";

export const SessionContext = createContext({});

const SessionContextProvider = (props) => {
	const [cookies, setCookie] = useCookies(["keep_logged", "access_token"]);
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
		if (LoggedIn === false && cookies.keep_logged && cookies.access_token) {
			Me.LoginCookies(cookies.access_token).then((response) => {
				if (response.error) return false;
				if (response.loggedin) {
					setLoggedIn(true);
				}
			});
		}
	}, [LoggedIn, cookies, setCookie]);

	return (
		<SessionContext.Provider value={provider}>
			{props.children}
		</SessionContext.Provider>
	);
};

export default SessionContextProvider;
