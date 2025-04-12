import { Button } from "@mui/material";
import { Playlist } from "../API";
import { useContext, useState, useCallback } from "react";
import { PlaylistContext } from "../context/PlaylistContextProvider";

const postProcessPlaylist = (
	response,
	PlaylistId,
	{
		playlistTracks,
		setPlaylistTracks,
		playlistRecommendedTracks,
		setPlaylistRecommendedTracks,
		playlistDeletedSongs,
		setPlaylistDeletedSongs,
	}
) => {
	if (playlistTracks[PlaylistId]) {
		playlistTracks[PlaylistId] = [response, ...playlistTracks[PlaylistId]];
		setPlaylistTracks({ ...playlistTracks });
	}

	if (playlistRecommendedTracks[PlaylistId]) {
		const recommendedfiltered = playlistRecommendedTracks[
			PlaylistId
		].filter((song) => {
			return response.id !== song.id;
		});
		if (
			playlistRecommendedTracks[PlaylistId].length !==
			recommendedfiltered.length
		) {
			playlistRecommendedTracks[PlaylistId] = recommendedfiltered;

			if (playlistRecommendedTracks[PlaylistId] < 5) {
				delete playlistRecommendedTracks[PlaylistId];
			}
			setPlaylistRecommendedTracks({
				...playlistRecommendedTracks,
			});
		}
	}

	if (playlistDeletedSongs[PlaylistId]) {
		const deletedfiltered = playlistDeletedSongs[PlaylistId].filter(
			(song) => {
				return response.id !== song.id;
			}
		);
		if (
			playlistDeletedSongs[PlaylistId].length !== deletedfiltered.length
		) {
			playlistDeletedSongs[PlaylistId] = deletedfiltered;
			setPlaylistDeletedSongs({
				...playlistDeletedSongs,
			});
		}
	}
};

const ButtonAddSong = ({ PlaylistId, uri }) => {
	const playlistcontext = useContext(PlaylistContext);
	const [disabled, setDisabled] = useState(false);

	const addButtonCallback = useCallback(() => {
		setDisabled(true);
		Playlist.AddSong(PlaylistId, uri).then((response) => {
			setDisabled(false);
			if (response.error) {
				console.log(response);
				return;
			}
			postProcessPlaylist(response, PlaylistId, playlistcontext);
		});
	}, [PlaylistId, uri, playlistcontext]);

	return (
		<Button disabled={disabled} onClick={addButtonCallback}>
			Add
		</Button>
	);
};

export default ButtonAddSong;
