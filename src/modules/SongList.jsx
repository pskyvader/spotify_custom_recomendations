import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { Playlist } from "../API";

const removeRow = (id, tmpData) => {
	tmpData.rows = tmpData.rows.filter((item, key) => key !== id - 1);
	tmpData.rows = tmpData.rows.map((item, key) => {
		item.id = key + 1;
		return item;
	});
	return { ...tmpData };
};

const addRow = (cellData, tmpData) => {
	tmpData.rows.push(cellData);
	return { ...tmpData };
};

const ElementList = (songList, ElementId, action = "add") => {
	const [data, setData] = useState({ columns: [], rows: [] });
	useEffect(() => {
		let tmpData = {};
		const rows = songList;
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
								if (action === "add") {
									Playlist.AddSong(ElementId, uri).then(
										setData(addRow(cellData, tmpData))
									);
								} else if (action === "delete") {
									Playlist.DeleteSong(ElementId, uri).then(
										setData(removeRow(id, tmpData))
									);
								}
							}}
						>
							Delete
						</Button>
					);
				},
			},
		];

		tmpData = {
			rows,
			columns,
		};
		setData(tmpData);
	}, [songList, ElementId, action]);

	return data;
};

export default ElementList;
