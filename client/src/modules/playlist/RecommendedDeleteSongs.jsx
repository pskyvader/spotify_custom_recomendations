import { useContext, useEffect } from "react";
import { CircularProgress } from "@mui/material";
import { Playlist } from "../../API";
import SongList, { SongListColumns } from "../../components/SongList";
import ButtonRemoveSong from "../../components/ButtonRemoveSong";
import { PlaylistContext } from "../../context/PlaylistContextProvider";
import { PlayerContext } from "../../context/PlayerContextProvider";
const RecommendedDeleteSongs = ({ playlistId, hidden }) => {
	const { playlistDeleteTracks, setPlaylistDeleteTracks, playlistTracks } =
		useContext(PlaylistContext);
	const { setCurrentSong } = useContext(PlayerContext);
	useEffect(() => {
		if (!playlistTracks[playlistId]) {
			return;
		}
		if (!playlistDeleteTracks[playlistId]) {
			Playlist.PlaylistDeleteRecommended(playlistId).then((response) => {
				if (response.error) return console.log(response);
				playlistDeleteTracks[playlistId] = response;
				setPlaylistDeleteTracks({ ...playlistDeleteTracks });
			});
		}
	}, [
		playlistId,
		playlistDeleteTracks,
		setPlaylistDeleteTracks,
		playlistTracks,
	]);
	if (playlistId === null) {
		return null;
	}
	if (hidden) {
		return null;
	}
	if (playlistDeleteTracks[playlistId]) {
		const data = SongListColumns(
			playlistDeleteTracks[playlistId],
			playlistId,
			ButtonRemoveSong,
			setCurrentSong
		);
		data.columns.splice(2, 0, {
			field: "played_date",
			headerName: "Played",
			minWidth: 200,
			flex: 1,
			renderCell: (cellData) => {
				console.log(cellData.formattedValue);
				return cellData.formattedValue !== null
					? new Date(cellData.formattedValue).toLocaleString()
					: "";
			},
		});
		return <SongList data={data} title="Recommended for delete" />;
	}
	return <CircularProgress />;
};
export default RecommendedDeleteSongs;
