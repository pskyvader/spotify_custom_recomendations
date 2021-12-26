import { useContext, useEffect } from "react";
import { CircularProgress } from "@mui/material";
import { Playlist } from "../../API";
import ButtonAddSong from "../../components/ButtonAddSong";
import { PlaylistContext } from "../../context/PlaylistContextProvider";

import SongList, { SongListColumns } from "../../components/SongList";

const AddSongs = ({ playlistId }) => {
	const { playlistRecommendedTracks, setPlaylistRecommendedTracks } =
		useContext(PlaylistContext);
	useEffect(() => {
		if (!playlistRecommendedTracks[playlistId]) {
			Playlist.PlaylistRecommended(playlistId).then((response) => {
				if (response.error) return console.log(response);
				playlistRecommendedTracks[playlistId] = response;
				setPlaylistRecommendedTracks({...playlistRecommendedTracks});
			});
		}
	}, [playlistId, playlistRecommendedTracks, setPlaylistRecommendedTracks]);

	if (playlistId === null) {
		return null;
	}
	if (playlistRecommendedTracks[playlistId]) {
		const data = SongListColumns(
			playlistRecommendedTracks[playlistId],
			playlistId,
			ButtonAddSong
		);
		return <SongList data={data} title="Recommended Songs"/>;
	}

	return <CircularProgress />;
};

export default AddSongs;
