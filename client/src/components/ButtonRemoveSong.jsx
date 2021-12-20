import { Button } from "@mui/material";
import { Playlist } from "../API";
import { useContext } from "react";
import { PlaylistContext } from "../context/PlaylistContextProvider";

const ButtonRemoveSong = ({ PlaylistId, uri, id }) => {
	const { setPlaylistId } = useContext(PlaylistContext);
	return (
		<Button
			onClick={() => {
				setPlaylistId(null);
				Playlist.DeleteSong(PlaylistId, uri).then(() => {
					setPlaylistId(PlaylistId);
				});
			}}
		>
			Remove
		</Button>
	);
};


export default ButtonRemoveSong;