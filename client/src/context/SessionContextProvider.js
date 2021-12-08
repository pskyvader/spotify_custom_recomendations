import { createContext, useMemo, useState } from "react";
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
    Me.LoggedIn().then((response) => {
        if (response.error) return false;
        setLoggedIn(response.loggedin);
    });

    return (
        <SessionContext.Provider value={provider}>
            {props.children}
        </SessionContext.Provider>
    );
};

export default SessionContextProvider;
