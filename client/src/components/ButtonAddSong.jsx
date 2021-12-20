import { Button } from "@mui/material";
import { Playlist } from "../API";
import { useContext } from "react";
import { PlaylistContext } from "../context/PlaylistContextProvider";


const ButtonAddSong = ({ PlaylistId, uri }) => {
	const { setPlaylistId } = useContext(PlaylistContext);
	return (
		<Button
			onClick={() => {
				setPlaylistId(null);
				Playlist.AddSong(PlaylistId, uri).then(() => {
					setPlaylistId(PlaylistId);
				});
			}}
		>
			Add
		</Button>
	);
};

export default ButtonAddSong;