import * as React from "react";
import { useEffect, useState } from "react";
import { Box } from "@mui/system";
import { CircularProgress } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { createTheme } from "@mui/material/styles";

import { objectToList } from "./Utils";
import Playlist from "./API/Playlist";

function useData(items) {
	const [data, setData] = React.useState({ columns: [], rows: [] });

	console.log(DataGrid);


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
				action:<div>uwu</div>
			};

			rows.push(row);
		});

		const columns = [
			{ field: "id", headerName: "#", minWidth: 40, flex: 0.1 },
			{ field: "name", headerName: "Title", flex: 1 },
			{ field: "artist", headerName: "Artist", flex: 1 },
			{ field: "album", headerName: "Album", flex: 1 },
			{ field: "action", headerName: "", minWidth:120, flex: 1,  },
		];

		setData({
			rows,
			columns,
		});
	}, [items]);

	return data;
}


const renderRow=(a,b)=>{
	return <div>a</div>;
}

const PlaylistTemplate = ({ response }) => {
	const theme = createTheme();
	const data = useData(response.tracks.items);
	return (
		<Box sx={{ height: "100%", padding: theme.spacing() }}>
			<DataGrid
				hideFooter
				checkboxSelection
				components={{Row:renderRow}}
				{...data}
				columnBuffer={2}
				columnThreshold={2}
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
