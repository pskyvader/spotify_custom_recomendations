import * as React from "react";
import { useEffect, useState } from "react";
import { Box } from "@mui/system";
import { Button, CircularProgress } from "@mui/material";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import { createTheme } from "@mui/material/styles";

import { objectToList } from "./Utils";
import Playlist, { DeleteSong } from "./API/Playlist";

function useData(items, playlistId) {
	const [data, setData] = React.useState({ columns: [], rows: [] });

	React.useEffect(() => {
		const rows = [];
		items.forEach((element, key) => {
			const art = element.track.artists.map(
				(artist) => " " + artist.name + " "
			);
			const row = {
				id: key,
				name: element.track.name,
				artist: art,
				album: element.track.album.name,
				action: element.track.uri,
			};
			rows.push(row);
		});

		const columns = [
			{ field: "id", headerName: "#", minWidth: 40, flex: 0.1 },
			{ field: "name", headerName: "Title", flex: 1 },
			{ field: "artist", headerName: "Artist", flex: 1 },
			{ field: "album", headerName: "Album", flex: 1 },
			{
				field: "action",
				headerName: "",
				minWidth: 120,
				flex: 1,
				renderCell: (cellData) => {
					const id = cellData.id;
					const uri = cellData.formattedValue;
					return (
						<Button
							onClick={() => {
								DeleteSong(playlistId, uri).then(setData(data));
							}}
						>
							Delete
						</Button>
					);
				},
			},
		];

		setData({
			rows,
			columns,
		});
	}, [items, playlistId]);

	return data;
}

const PlaylistTemplate = ({ response }) => {
	const apiRef = useGridApiRef();
	const theme = createTheme();
	const data = useData(response.tracks.items, response.id);
	return (
		<Box sx={{ height: "100%", padding: theme.spacing() }}>
			<DataGrid
				hideFooter
				checkboxSelection
				disableSelectionOnClick
				{...data}
				columnBuffer={2}
				columnThreshold={2}
				apiRef={apiRef}
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
		Playlist(id).then((response) => {
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
