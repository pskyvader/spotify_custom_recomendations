import { createContext, useMemo, useState } from "react";
import { Me } from "../API";

export const PlaylistContext = createContext({});

const PlaylistContextProvider = (props) => {
	const [playlistId, setPlaylistId] = useState(null);
	const [playlists, setPlaylists] = useState(null);
	const provider = useMemo(
		() => ({
			playlistId,
			setPlaylistId,
			playlists,
			setPlaylists,
		}),
		[playlistId, playlists]
	);
	
	useMemo(() => {
		return Me.MePlaylist().then((response) => {
			if (response.error) return;
			setPlaylists(response);
		});
	}, []);

	return (
		<PlaylistContext.Provider value={provider}>
			{props.children}
		</PlaylistContext.Provider>
	);
};

export default PlaylistContextProvider;
