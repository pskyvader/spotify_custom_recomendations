import { useContext, useEffect } from "react";
import { CircularProgress } from "@mui/material";

import { Playlist } from "../../API";
import SongList, { SongListColumns } from "../../components/SongList";
import { PlaylistContext } from "../../context/PlaylistContextProvider";
import { PlayerContext } from "../../context/PlayerContextProvider";

const LastPlayedSongs = ({ hidden }) => {
	const { lastPlayedTracks, setLastPlayedTracks } =
		useContext(PlaylistContext);
	const { setCurrentSong } = useContext(PlayerContext);
	useEffect(() => {
		if (!lastPlayedTracks) {
			Playlist.LastPlayed().then((response) => {
				if (response.error) return console.log(response);
				setLastPlayedTracks(response);
			});
		}
	}, [lastPlayedTracks, setLastPlayedTracks]);

	if (hidden) {
		return null;
	}
	if (lastPlayedTracks) {
		const data = SongListColumns(
			lastPlayedTracks,
			null,
			null,
			setCurrentSong
		);
		data.columns.push({
			field: "played_date",
			headerName: "Last Played",
			minWidth: 200,
			flex: 1,
			renderCell: (cellData) => {
				return new Date(cellData.formattedValue).toLocaleString();
			},
		});
		return (
			<SongList
				data={data}
				title="Last Played Songs"
			/>
		);
	}
	return <CircularProgress />;
};
export default LastPlayedSongs;
