import * as React from "react";
import { useEffect, useState } from "react";
import { Box } from "@mui/system";
import { CircularProgress } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { createTheme,styled } from "@mui/material/styles";

import { objectToList } from "./Utils";
import Me from "./API/Me";
import Playlist from "./API/Playlist";

function useData(items) {
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
			};

			rows.push(row);
		});

		const columns = [
			{ field: "id", headerName: "#", minWidth: 40,flex:0.1 },
			{ field: "name", headerName: "Title", flex: 1 },
			{ field: "artist", headerName: "Artist", flex: 1 },
			{ field: "album", headerName: "Album", flex: 1 },
		];

		setData({
			rows,
			columns,
		});
	}, [items]);

	return data;
}


const Root = styled('div')(({ theme }) => ({
	maxHeight: "calc(50vh - " + theme.mixins.toolbar.minHeight + "px)",
	height:5000,
	[theme.breakpoints.up('md')]: {
		maxHeight: "calc(100vh - " + theme.mixins.toolbar.minHeight + "px)",
	},
  }));


const PlaylistTemplate = ({ response, me }) => {
	const theme = createTheme();
	const data = useData(response.tracks.items);
	return (
		<Root>
			<DataGrid  
			hideFooter
				{...data}
				columnBuffer={2}
				columnThreshold={2}
			/>
		</Root>
	);
};

const PlaylistDetail = ({ id }) => {
	const [playlist, setPlaylist] = useState(<CircularProgress />);

	useEffect(() => {
		if (id === null) {
			return;
		}
		Playlist(id).then((response) => {
			Me().then((me) => {
				if (response.error) {
					setPlaylist(objectToList(response));
					console.log("Playlistdetail", id);
				} else {
					setPlaylist(
						<PlaylistTemplate response={response} me={me} />
					);
				}
			});
		});
	}, [id]);

	return playlist;
};

export default PlaylistDetail;
