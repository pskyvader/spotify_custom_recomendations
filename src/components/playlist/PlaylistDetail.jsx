import { useEffect, useState } from "react";
import { Box } from "@mui/system";
import { CircularProgress } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { createTheme } from "@mui/material/styles";

import { objectToList } from "../../utils";
import { Playlist } from "../../API";
import ElementList from "../../modules/SongList";
import FormatSongList from "../../modules/FormatSongList";


const PlaylistTemplate = ({ response }) => {
	const theme = createTheme();
	const songList=FormatSongList(response.tracks.items);
	const data = ElementList(songList, response.id,"delete");
	return (
		<Box sx={{ height: "100%", padding: theme.spacing() }}>
			<DataGrid
				hideFooter
				disableSelectionOnClick
				{...data}
				columnBuffer={2}
				columnThreshold={2}
				disableExtendRowFullWidth
			/>
		</Box>
	);
};

const PlaylistDetail = ({ id }) => {
	const [playlist, setPlaylist] = useState(<CircularProgress />);

	useEffect(() => {
		if (id === null) {
			return false;
		}
		Playlist.Playlist(id).then((response) => {
			if (response.error) {
				setPlaylist(objectToList(response));
				console.log("Playlistdetail", id);
			} else {
				setPlaylist(<PlaylistTemplate response={response} />);
			}
		}).catch((e) => console.log(e));
	}, [id]);

	return playlist;
};

export default PlaylistDetail;
