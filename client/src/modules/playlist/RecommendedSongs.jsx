import { useContext, useEffect } from "react";
import { CircularProgress } from "@mui/material";
import { Playlist } from "../../API";
import ButtonAddSong from "../../components/ButtonAddSong";
import { PlaylistContext } from "../../context/PlaylistContextProvider";
import { PlayerContext } from "../../context/PlayerContextProvider";

import SongList, { SongListColumns } from "../../components/SongList";

const RecommendedSongs = ({ playlistId, hidden }) => {
	const {
		playlistRecommendedTracks,
		setPlaylistRecommendedTracks,
		playlistTracks,
	} = useContext(PlaylistContext);
	const { setCurrentSong } = useContext(PlayerContext);
	useEffect(() => {
		if (!playlistTracks[playlistId]) {
			return;
		}
		if (!playlistRecommendedTracks[playlistId]) {
			Playlist.PlaylistRecommended(playlistId).then((response) => {
				if (response.error) return console.log(response);
				playlistRecommendedTracks[playlistId] = response;
				setPlaylistRecommendedTracks({ ...playlistRecommendedTracks });
			});
		}
	}, [
		playlistId,
		playlistRecommendedTracks,
		setPlaylistRecommendedTracks,
		playlistTracks,
	]);

	if (playlistId === null) {
		return null;
	}
	if (hidden) {
		return null;
	}
	if (playlistRecommendedTracks[playlistId]) {
		const data = SongListColumns(
			playlistRecommendedTracks[playlistId],
			playlistId,
			ButtonAddSong,
			setCurrentSong
		);
		return <SongList data={data} title="Recommended Songs" />;
	}

	return <CircularProgress />;
};

export default RecommendedSongs;
