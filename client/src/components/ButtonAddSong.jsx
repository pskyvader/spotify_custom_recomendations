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
		playlistDeletedSongs,
		setPlaylistDeletedSongs,
	} = useContext(PlaylistContext);
	return (
		<Button
			onClick={() => {
				Playlist.AddSong(PlaylistId, uri).then((response) => {
					console.log(response, playlistTracks[PlaylistId]);
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
