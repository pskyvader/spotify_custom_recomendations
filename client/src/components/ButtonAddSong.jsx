import { Button } from "@mui/material";
import { Playlist } from "../API";
import { useContext, useState, useCallback } from "react";
import { PlaylistContext } from "../context/PlaylistContextProvider";

const PostProcessPlaylist = (response, PlaylistId) => {
	const {
		playlistTracks,
		setPlaylistTracks,
		playlistRecommendedTracks,
		setPlaylistRecommendedTracks,
		playlistDeletedSongs,
		setPlaylistDeletedSongs,
	} = useContext(PlaylistContext);

	playlistTracks[PlaylistId] = [response, ...playlistTracks[PlaylistId]];
	setPlaylistTracks({ ...playlistTracks });

	const recommendedfiltered = playlistRecommendedTracks[PlaylistId].filter(
		(song) => {
			return response.id !== song.id;
		}
	);
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

	const deletedfiltered = playlistDeletedSongs[PlaylistId].filter((song) => {
		return response.id !== song.id;
	});
	if (playlistDeletedSongs[PlaylistId].length !== deletedfiltered.length) {
		playlistDeletedSongs[PlaylistId] = deletedfiltered;
		setPlaylistDeletedSongs({
			...playlistDeletedSongs,
		});
	}
};

const ButtonAddSong = ({ PlaylistId, uri }) => {
	const [disabled, setDisabled] = useState(false);

	const addButtonCallback = useCallback(() => {
		setDisabled(true);
		Playlist.AddSong(PlaylistId, uri).then((response) => {
			setDisabled(false);
			if (response.error) {
				console.log(response);
				return;
			}
			PostProcessPlaylist(response, PlaylistId);
		});
	}, [PlaylistId, uri]);

	return (
		<Button disabled={disabled} onClick={addButtonCallback}>
			Add
		</Button>
	);
};

export default ButtonAddSong;
