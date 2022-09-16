import { useContext, useEffect } from "react";
import { CircularProgress } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import ListItemText from "@mui/material/ListItemText";

import { Playlist } from "../../API";
import SongList from "../../components/SongList";
import { PlaylistContext } from "../../context/PlaylistContextProvider";

const LastPlayedSongs = ({ hidden }) => {
	const { lastPlayedTracks, setLastPlayedTracks } =
		useContext(PlaylistContext);
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
		const columns = [
			// { field: "id", headerName: "#", minWidth: 40, flex: 0.1 },
			{
				field: "name",
				headerName: "Title",
				minWidth: 200,
				flex: 1,
				renderCell: (cellData) => {
					return (
						<Stack direction="row" spacing={2}>
							<Avatar src={cellData.row.image} />
							<ListItemText
								primary={cellData.row.name}
								secondary={cellData.row.artist}
							/>
						</Stack>
					);
				},
			},
			// { field: "artist", headerName: "Artist", minWidth: 200, flex: 1 },
			{ field: "album", headerName: "Album", minWidth: 200, flex: 1 },
			{
				field: "played_date",
				headerName: "Last Played",
				minWidth: 200,
				flex: 1,
				renderCell: (cellData) =>
					new Date(cellData.formattedValue).toLocaleString(),
			},
		];

		const data = {
			rows: lastPlayedTracks,
			columns,
		};

		return <SongList data={data} title="Last Played Songs" />;
	}
	return <CircularProgress />;
};
export default LastPlayedSongs;
