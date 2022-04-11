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
		playlistDeleteTracks,
		setPlaylistDeleteTracks,
		playlistDeletedSongs,
		setPlaylistDeletedSongs,
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
					delete playlistDeleteTracks[PlaylistId];
					setPlaylistDeleteTracks({
						...playlistDeleteTracks,
					});
					delete playlistDeletedSongs[PlaylistId];
					setPlaylistDeletedSongs({
						...playlistDeletedSongs,
					});
				});
			}}
		>
			Add
		</Button>
	);
};

export default ButtonAddSong;
