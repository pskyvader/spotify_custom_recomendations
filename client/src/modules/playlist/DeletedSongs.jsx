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
	if (playlistId === false || playlistId === "false" || playlistId === undefined) {
		console.warn("Invalid playlist id in DeletedSongs:", playlistId);
	}
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
		// Precompute a numeric Removed timestamp on each row so sorting works reliably
		const rows = playlistDeletedSongs[playlistId].map((r) => {
			const removedDate = r?.PlaylistSong?.removed_date;
			return { ...r, Removed: removedDate ? new Date(removedDate).getTime() : null };
		});
		// console.log("DeletedSongs prepared rows with Removed field:", rows.map((r) => ({ id: r.id, Removed: r.Removed })));

		const data = SongListColumns(rows, playlistId, ButtonAddSong, setCurrentSong);
		data.columns.splice(2, 0, {
			field: "Removed",
			headerName: "Removed",
			minWidth: 200,
			flex: 1,
			valueFormatter: (params) => {
				// DataGrid may pass the raw value or a params object depending on version; support both.
				const v = params && typeof params === "object" ? params.value : params;
				return v ? new Date(v).toLocaleString() : "";
			},
			// numeric sort will work on timestamp values; ensure nulls sort last by treating null as 0
			sortComparator: (v1, v2) => {
				const a = v1 && typeof v1 === "object" ? v1.value : v1;
				const b = v2 && typeof v2 === "object" ? v2.value : v2;
				return (a || 0) - (b || 0);
			},
		});

		return <SongList data={data} title="Deleted songs from playlist" />;
	}
	return <CircularProgress />;
};
export default DeletedSongs;
