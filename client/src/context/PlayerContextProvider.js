import { createContext, useState } from "react";

export const PlayerContext = createContext({});

const PlayerContextProvider = (props) => {
	const [playing, setPlaying] = useState(null);
	const provider = { playing, setPlaying };

	return (
		<PlayerContext.Provider value={provider}>
			{props.children}
		</PlayerContext.Provider>
	);
};

export default PlayerContextProvider;
