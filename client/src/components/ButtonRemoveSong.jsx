import { Button } from "@mui/material";
import { Playlist } from "../API";
import { useContext, useState } from "react";
import { PlaylistContext } from "../context/PlaylistContextProvider";

const ButtonRemoveSong = ({ PlaylistId, uri }) => {
	const [disabled, setDisabled] = useState(false);
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
			disabled={disabled}
			onClick={() => {
				setDisabled(true);
				Playlist.DeleteSong(PlaylistId, uri).then((response) => {
					setDisabled(false);
					if (response.error) {
						console.log(response);
						return;
					}

					const playlistFiltered = playlistTracks[PlaylistId].filter(
						(song) => {
							return response.SongId !== song.id;
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
						return response.SongId !== song.id;
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
