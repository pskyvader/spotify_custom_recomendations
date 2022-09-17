import { useContext, useEffect } from "react";
import { CircularProgress } from "@mui/material";
import { Playlist } from "../../API";
import SongList, { SongListColumns } from "../../components/SongList";
import ButtonAddSong from "../../components/ButtonAddSong";
import { PlaylistContext } from "../../context/PlaylistContextProvider";

const DeletedSongs = ({ playlistId, hidden }) => {
	const { playlistDeletedSongs, setPlaylistDeletedSongs } =
		useContext(PlaylistContext);
	useEffect(() => {
		if (!playlistDeletedSongs[playlistId]) {
			Playlist.DeletedSongs(playlistId).then((response) => {
				if (response.error) return console.log(response);
				playlistDeletedSongs[playlistId] = response;
				setPlaylistDeletedSongs({ ...playlistDeletedSongs });
			});
		}
	}, [playlistId, playlistDeletedSongs, setPlaylistDeletedSongs]);
	if (playlistId === null) {
		return null;
	}
	if (hidden) {
		return null;
	}
	if (playlistDeletedSongs[playlistId]) {
		const data = SongListColumns(
			playlistDeletedSongs[playlistId],
			playlistId,
			ButtonAddSong
		);
		const button = data.columns.pop();
		data.columns.push({
			field: "removed_date",
			headerName: "Removed",
			minWidth: 200,
			flex: 1,
			renderCell: (cellData) =>
				new Date(cellData.formattedValue).toLocaleString(),
		});
		data.columns.push(button);

		return <SongList data={data} title="Deleted songs from playlist" />;
	}
	return <CircularProgress />;
};
export default DeletedSongs;
