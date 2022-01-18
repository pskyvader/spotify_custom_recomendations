import { useContext, useEffect } from "react";
import { CircularProgress } from "@mui/material";
import { Playlist } from "../../API";
import SongList, { SongListColumns } from "../../components/SongList";
import ButtonRemoveSong from "../../components/ButtonRemoveSong";
import { PlaylistContext } from "../../context/PlaylistContextProvider";
const RecommendedDeleteSongs = ({ playlistId,hidden }) => {
	const { playlistDeleteTracks, setPlaylistDeleteTracks } =
		useContext(PlaylistContext);
	useEffect(() => {
		if (!playlistDeleteTracks[playlistId]) {
			Playlist.PlaylistDeleteRecommended(playlistId).then((response) => {
				if (response.error) return console.log(response);
				playlistDeleteTracks[playlistId] = response;
				setPlaylistDeleteTracks({ ...playlistDeleteTracks });
			});
		}
	}, [playlistId, playlistDeleteTracks, setPlaylistDeleteTracks]);
	if (playlistId === null) {
		return null;
	}
	if(hidden) {
		return null;
	}
	if (playlistDeleteTracks[playlistId]) {
		const data = SongListColumns(
			playlistDeleteTracks[playlistId],
			playlistId,
			ButtonRemoveSong
		);
		return <SongList data={data} title="Recommended for delete" />;
	}
	return <CircularProgress />;
};
export default RecommendedDeleteSongs;
