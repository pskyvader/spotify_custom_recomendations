import { useContext, useEffect } from "react";
import { CircularProgress } from "@mui/material";
import { Playlist } from "../../API";
import ButtonAddSong from "../../components/ButtonAddSong";
import { PlaylistContext } from "../../context/PlaylistContextProvider";

import SongList, { SongListColumns } from "../../components/SongList";

const RecommendedSongs = ({ playlistId, hidden }) => {
	const {
		playlistRecommendedTracks,
		setPlaylistRecommendedTracks,
		playlistTracks,
	} = useContext(PlaylistContext);
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
			playlistRecommendedTracks[playlistId].map((song) => {
				song.uri = song.id;
				return song;
			}),
			playlistId,
			ButtonAddSong
		);
		return <SongList data={data} title="Recommended Songs" />;
	}

	return <CircularProgress />;
};

export default RecommendedSongs;
