import { createContext, useMemo, useState } from "react";

export const PlaylistContext = createContext({});

const PlaylistContextProvider = (props) => {
	const [playlistId, setPlaylistId] = useState(null);
	const provider = useMemo(() => ({ playlistId, setPlaylistId }), [playlistId]);    
	return (
		<PlaylistContext.Provider value={provider}>
			{props.children}
		</PlaylistContext.Provider>
	);
};

export default PlaylistContextProvider;
