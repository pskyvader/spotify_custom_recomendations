import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { Playlist } from "../../API";

const ElementList = (items, ElementId) => {
	const [data, setData] = useState({ columns: [], rows: [] });

	useEffect(() => {
		const rows = [];
		items.forEach((element, key) => {
			const art = element.track.artists.map(
				(artist) => " " + artist.name + " "
			);
			const row = {
				id: key + 1,
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
								Playlist.DeleteSong(ElementId, uri).then(
									removeRow(id)
								);
							}}
						>
							Delete
						</Button>
					);
				},
			},
		];

		const removeRow = (id) => {
			tmpData.rows = tmpData.rows.filter((item, key) => key !== id - 1);
			tmpData.rows = tmpData.rows.map((item, key) => {
				item.id = key + 1;
				return item;
			});
			setData({ ...tmpData });
		};
		const tmpData = {
			rows,
			columns,
		};
		setData(tmpData);
	}, [items, ElementId]);

	return data;
};


export default ElementList;