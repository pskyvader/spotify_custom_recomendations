import { createContext, useState, useContext, useEffect } from "react";
import { Me } from "../API";
import { SessionContext } from "./SessionContextProvider";
import { ProfileContext } from "./ProfileContextProvider";

export const PlaylistContext = createContext({});

const PlaylistContextProvider = (props) => {
	const { LoggedIn } = useContext(SessionContext);
	const { profile } = useContext(ProfileContext);
	const [playlistId, setPlaylistId] = useState(null);
	const [playlists, setPlaylists] = useState(null);
	const provider = {
		playlistId,
		setPlaylistId,
		playlists,
		setPlaylists,
	};

	useEffect(() => {
		if (LoggedIn && profile !== null && playlists === null) {
			Me.MePlaylist().then((response) => {
				if (response.error) {
					console.log(response);
					return false;
				}
				setPlaylists(response);
			});
		}
		return false;
	}, [LoggedIn, profile, playlists]);

	return (
		<PlaylistContext.Provider value={provider}>
			{props.children}
		</PlaylistContext.Provider>
	);
};

export default PlaylistContextProvider;
