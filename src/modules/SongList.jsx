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
	// const [data, setData] = useState({ columns: [], rows: [] });
	let data={}

	// useEffect(() => {
		const buttonAction = () => {
			if (action === "add") {
				return (
					<Button
						onClick={(cellData, data) => {
							const uri = cellData.formattedValue;
							Playlist.AddSong(ElementId, uri).then(
								data=(addRow(cellData, data))
							);
						}}
					>
						Add
					</Button>
				);
			} else if (action === "delete") {
				return (
					<Button
						onClick={(cellData, data) => {
							const id = cellData.id;
							const uri = cellData.formattedValue;
							Playlist.DeleteSong(ElementId, uri).then(
								data=(removeRow(id, data))
							);
						}}
					>
						Delete
					</Button>
				);
			}
		};

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
					return buttonAction();
					// return "uwu"
				},
			},
		];

		tmpData = {
			rows,
			columns,
		};
		// setData(tmpData);
		data=tmpData
	// }, [songList, ElementId,action]);

	return data;
};

export default ElementList;
