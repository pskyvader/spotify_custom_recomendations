import * as React from "react";
import { useEffect, useState } from "react";
import { Box } from "@mui/system";
import { CircularProgress } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { createTheme } from "@mui/material/styles";

import { objectToList } from "../../utils";
import { Playlist } from "../../API";

import ElementList from "../../modules/ElementList";


const PlaylistTemplate = ({ response }) => {
	const theme = createTheme();
	const data = ElementList(response.tracks.items, response.id);
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
			return;
		}
		Playlist.Playlist(id).then((response) => {
			if (response.error) {
				setPlaylist(objectToList(response));
				console.log("Playlistdetail", id);
			} else {
				setPlaylist(<PlaylistTemplate response={response} />);
			}
		});
	}, [id]);

	return playlist;
};

export default PlaylistDetail;
