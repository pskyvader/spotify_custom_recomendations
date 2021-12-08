import { createContext, useMemo, useState, useContext } from "react";
import { Me } from "../API";
import { SessionContext } from "./SessionContextProvider";

export const PlaylistContext = createContext({});

const PlaylistContextProvider = (props) => {
	const { LoggedIn } = useContext(SessionContext);
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
		if (LoggedIn) {
			return Me.MePlaylist().then((response) => {
				if (response.error) return false;
				console.log(response);
				setPlaylists(response);
			});
		}
		return false;
	}, [LoggedIn]);

	return (
		<PlaylistContext.Provider value={provider}>
			{props.children}
		</PlaylistContext.Provider>
	);
};

export default PlaylistContextProvider;
