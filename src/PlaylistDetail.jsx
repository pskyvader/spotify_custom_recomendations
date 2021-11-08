import * as React from "react";
import { useEffect, useState } from "react";
import { Box } from "@mui/system";
import { CircularProgress } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

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
			{ field: "id", hide: true, flex: 1 },
			{ field: "name", headerName: "Name", flex: 1 },
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

const PlaylistTemplate = ({ response, me }) => {
	const data = useData(response.tracks.items);
	return (
		<Box style={{ height: "100%", width: "100%" }}>
			<DataGrid
			hideFooter
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
