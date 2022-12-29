import { Button } from "@mui/material";
import { Playlist } from "../API";
import { useContext, useState } from "react";
import { PlaylistContext } from "../context/PlaylistContextProvider";

const ButtonAddSong = ({ PlaylistId, uri }) => {
	const [disabled, setDisabled] = useState(false);
	const {
		playlistTracks,
		setPlaylistTracks,
		playlistRecommendedTracks,
		setPlaylistRecommendedTracks,
		playlistDeletedSongs,
		setPlaylistDeletedSongs,
	} = useContext(PlaylistContext);
	return (
		<Button
			disabled={disabled}
			onClick={() => {
				setDisabled(true);
				Playlist.AddSong(PlaylistId, uri).then((response) => {
					setDisabled(false);
					if (response.error) {
						console.log(response);
						return;
					}
					playlistTracks[PlaylistId] = [
						response.song,
						...playlistTracks[PlaylistId],
					];
					setPlaylistTracks({ ...playlistTracks });

					const recommendedfiltered = playlistRecommendedTracks[
						PlaylistId
					].filter((song) => {
						return response.song.id !== song.id;
					});
					if (
						playlistRecommendedTracks[PlaylistId].length !==
						recommendedfiltered.length
					) {
						playlistRecommendedTracks[PlaylistId] =
							recommendedfiltered;

						if (playlistRecommendedTracks[PlaylistId] < 5) {
							delete playlistRecommendedTracks[PlaylistId];
						}
						setPlaylistRecommendedTracks({
							...playlistRecommendedTracks,
						});
					}

					const deletedfiltered = playlistDeletedSongs[
						PlaylistId
					].filter((song) => {
						return response.song.id !== song.id;
					});
					if (
						playlistDeletedSongs[PlaylistId].length !==
						deletedfiltered.length
					) {
						playlistDeletedSongs[PlaylistId] = deletedfiltered;
						setPlaylistDeletedSongs({
							...playlistDeletedSongs,
						});
					}
				});
			}}
		>
			Add
		</Button>
	);
};

export default ButtonAddSong;
