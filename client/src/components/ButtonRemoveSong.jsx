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
		playlistDeleteTracks,
		setPlaylistDeleteTracks,
		playlistDeletedSongs,
		setPlaylistDeletedSongs,
	}
) => {
	playlistTracks[PlaylistId] = playlistTracks[PlaylistId] || [];
	playlistDeleteTracks[PlaylistId] = playlistDeleteTracks[PlaylistId] || [];
	playlistDeletedSongs[PlaylistId] = playlistDeletedSongs[PlaylistId] || [];

	const playlistFiltered = playlistTracks[PlaylistId].filter((song) => {
		return response.id !== song.id;
	});
	if (playlistTracks[PlaylistId].length !== playlistFiltered.length) {
		playlistTracks[PlaylistId] = playlistFiltered;
		setPlaylistTracks({ ...playlistTracks });
	}

	const deleterecommendedfiltered = playlistDeleteTracks[PlaylistId].filter(
		(song) => {
			return response.id !== song.id;
		}
	);
	if (
		playlistDeleteTracks[PlaylistId].length !==
		deleterecommendedfiltered.length
	) {
		playlistDeleteTracks[PlaylistId] = deleterecommendedfiltered;
		setPlaylistDeleteTracks({
			...playlistDeleteTracks,
		});
	}

	playlistDeletedSongs[PlaylistId] = [
		response,
		...playlistDeletedSongs[PlaylistId],
	];
	setPlaylistDeletedSongs({
		...playlistDeletedSongs,
	});
};

const ButtonRemoveSong = ({ PlaylistId, uri }) => {
	const playlistcontext = useContext(PlaylistContext);
	const [disabled, setDisabled] = useState(false);

	const deleteButtonCallback = useCallback(() => {
		setDisabled(true);
		Playlist.DeleteSong(PlaylistId, uri).then((response) => {
			setDisabled(false);
			if (response.error) {
				console.log(response);
				return;
			}
			postProcessPlaylist(response, PlaylistId, playlistcontext);
		});
	}, [PlaylistId, uri, playlistcontext]);

	return (
		<Button disabled={disabled} onClick={deleteButtonCallback}>
			Remove
		</Button>
	);
};

export default ButtonRemoveSong;
