import { createContext, useState } from "react";

export const PlayerContext = createContext({});

const PlayerContextProvider = (props) => {
	const [song, setCurrentSong] = useState(null);
	const provider = { song, setCurrentSong };

	return (
		<PlayerContext.Provider value={provider}>
			{props.children}
		</PlayerContext.Provider>
	);
};

export default PlayerContextProvider;
