import { Button } from "@mui/material";
import { Playlist } from "../API";
import { useContext } from "react";
import { PlaylistContext } from "../context/PlaylistContextProvider";

const ButtonAddSong = ({ PlaylistId, uri }) => {
	const {
		playlistTracks,
		setPlaylistTracks,
		playlistRecommendedTracks,
		setPlaylistRecommendedTracks,
	} = useContext(PlaylistContext);
	return (
		<Button
			onClick={() => {
				Playlist.AddSong(PlaylistId, uri).then((response) => {
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
			Add
		</Button>
	);
};

export default ButtonAddSong;
