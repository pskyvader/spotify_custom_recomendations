import { Button } from "@mui/material";
import { Playlist } from "../API";
import { useContext } from "react";
import { PlaylistContext } from "../context/PlaylistContextProvider";

const ButtonRemoveSong = ({ PlaylistId, uri }) => {
	const {
		playlistTracks,
		setPlaylistTracks,
		playlistDeleteTracks,
		setPlaylistDeleteTracks,
		playlistDeletedSongs,
		setPlaylistDeletedSongs,
	} = useContext(PlaylistContext);
	return (
		<Button
			onClick={() => {
				Playlist.DeleteSong(PlaylistId, uri).then((response) => {
					if (response.error) {
						console.log(response);
						return;
					}

					const playlistFiltered = playlistTracks[PlaylistId].filter(
						(song) => {
							return response.song.id !== song.id;
						}
					);
					if (
						playlistTracks[PlaylistId].length !==
						playlistFiltered.length
					) {
						playlistTracks[PlaylistId] = playlistFiltered;
						setPlaylistTracks({ ...playlistTracks });
					}

					const deleterecommendedfiltered = playlistDeleteTracks[
						PlaylistId
					].filter((song) => {
						return response.song.id !== song.id;
					});
					if (
						playlistDeleteTracks[PlaylistId].length !==
						deleterecommendedfiltered.length
					) {
						playlistDeleteTracks[PlaylistId] =
							deleterecommendedfiltered;
						setPlaylistDeleteTracks({
							...playlistDeleteTracks,
						});
					}

					playlistDeletedSongs[PlaylistId] = [
						response.song,
						...playlistDeletedSongs[PlaylistId],
					];
					setPlaylistDeletedSongs({
						...playlistDeletedSongs,
					});
				});
			}}
		>
			Remove
		</Button>
	);
};

export default ButtonRemoveSong;
