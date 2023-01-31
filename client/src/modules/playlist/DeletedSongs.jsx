import { useContext, useEffect } from "react";
import { CircularProgress } from "@mui/material";
import { Playlist } from "../../API";
import SongList, { SongListColumns } from "../../components/SongList";
import ButtonAddSong from "../../components/ButtonAddSong";
import { PlaylistContext } from "../../context/PlaylistContextProvider";
import { PlayerContext } from "../../context/PlayerContextProvider";

const DeletedSongs = ({ playlistId, hidden }) => {
	const { playlistDeletedSongs, setPlaylistDeletedSongs } =
		useContext(PlaylistContext);
	const { setCurrentSong } = useContext(PlayerContext);
	useEffect(() => {
		if (!hidden && !playlistDeletedSongs[playlistId]) {
			Playlist.DeletedSongs(playlistId).then((response) => {
				if (response.error) return console.log(response);
				playlistDeletedSongs[playlistId] = response;
				setPlaylistDeletedSongs({ ...playlistDeletedSongs });
			});
		}
	}, [hidden, playlistId, playlistDeletedSongs, setPlaylistDeletedSongs]);
	if (playlistId === null) {
		return null;
	}
	if (hidden) {
		return null;
	}
	if (playlistDeletedSongs[playlistId]) {
		console.log("Playlist deleted", playlistDeletedSongs[playlistId]);
		const data = SongListColumns(
			playlistDeletedSongs[playlistId],
			playlistId,
			ButtonAddSong,
			setCurrentSong
		);
		data.columns.splice(2, 0, {
			field: "Removed",
			// headerName: "Removed",
			minWidth: 200,
			flex: 1,
			valueGetter: (params) => {
				return new Date(
					params.row.PlaylistSong.removed_date
				).toLocaleString();
			},
		});

		return <SongList data={data} title="Deleted songs from playlist" />;
	}
	return <CircularProgress />;
};
export default DeletedSongs;
