import { Button } from "@mui/material";
import { Playlist } from "../API";
import { useContext } from "react";
import { PlaylistContext } from "../context/PlaylistContextProvider";


const ButtonAddSong = ({ PlaylistId, uri }) => {
	const { playlistTracks, setPlaylistTracks } = useContext(PlaylistContext);
	return (
		<Button
			onClick={() => {
				Playlist.AddSong(PlaylistId, uri).then((response) => {
					delete playlistTracks[PlaylistId];
					setPlaylistTracks(playlistTracks);
				});
			}}
		>
			Add
		</Button>
	);
};

export default ButtonAddSong;