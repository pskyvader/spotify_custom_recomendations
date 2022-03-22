import { createContext, useState, useContext, useEffect } from "react";
import { Me } from "../API";
import { SessionContext } from "./SessionContextProvider";
import { ProfileContext } from "./ProfileContextProvider";
export const PlaylistContext = createContext({});

const PlaylistContextProvider = (props) => {
	const { LoggedIn } = useContext(SessionContext);
	const { profile } = useContext(ProfileContext);
	const [playlists, setPlaylists] = useState(null);
	const [playlistTracks, setPlaylistTracks] = useState({});
	const [playlistActive, setPlaylistActive] = useState({});
	const [playlistRecommendedTracks, setPlaylistRecommendedTracks] = useState(
		{}
	);
	const [playlistDeleteTracks, setPlaylistDeleteTracks] = useState({});
	const [lastPlayedTracks, setLastPlayedTracks] = useState(null);
	const [playlistDeletedSongs, setPlaylistDeletedSongs] = useState({});
	const provider = {
		playlists,
		setPlaylists,
		playlistTracks,
		setPlaylistTracks,
		playlistRecommendedTracks,
		setPlaylistRecommendedTracks,
		playlistDeleteTracks,
		setPlaylistDeleteTracks,
		lastPlayedTracks,
		setLastPlayedTracks,
		playlistActive,
		setPlaylistActive,
		playlistDeletedSongs,
		setPlaylistDeletedSongs,
	};

	useEffect(() => {
		if (LoggedIn && profile !== null && playlists === null) {
			Me.MePlaylist().then((response) => {
				if (response.error) {
					return false;
				}
				setPlaylists(response);
			});
		}
	}, [LoggedIn, profile, playlists]);

	return (
		<PlaylistContext.Provider value={provider}>
			{props.children}
		</PlaylistContext.Provider>
	);
};

export default PlaylistContextProvider;
