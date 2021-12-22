import { Button } from "@mui/material";
import { Playlist } from "../API";
import { useContext } from "react";
import { PlaylistContext } from "../context/PlaylistContextProvider";

const ButtonRemoveSong = ({ PlaylistId, uri, id }) => {
	const {
		playlistTracks,
		setPlaylistTracks,
		playlistRecommendedTracks,
		setPlaylistRecommendedTracks,
	} = useContext(PlaylistContext);
	return (
		<Button
			onClick={() => {
				Playlist.DeleteSong(PlaylistId, uri).then((response) => {
					if (response.error) {
						console.log(response);
						return;
					}
					delete playlistTracks[PlaylistId];
					setPlaylistTracks({ ...playlistTracks });
					delete playlistRecommendedTracks[PlaylistId];
					setPlaylistRecommendedTracks({
						...playlistRecommendedTracks,
					});
				});
			}}
		>
			Remove
		</Button>
	);
};

export default ButtonRemoveSong;
