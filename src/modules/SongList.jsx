import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { Box } from "@mui/system";
import { DataGrid } from "@mui/x-data-grid";
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




const ElementList2 = (songList, ElementId, action = "add") => {
	// const [data, setData] = useState({ columns: [], rows: [] });

	const rows = songList;
	

	// useEffect(() => {
			const buttonAction = () => {
				if (action === "add") {
					return (
						<Button
							onClick={(cellData, tmpData) => {
								const uri = cellData.formattedValue;
								Playlist.AddSong(ElementId, uri).then(
									// setData(addRow(cellData, tmpData))
								);
							}}
						>
							Delete
						</Button>
					);
				} else if (action === "delete") {
					return (
						<Button
							onClick={(cellData, tmpData) => {
								const id = cellData.id;
								const uri = cellData.formattedValue;
								Playlist.DeleteSong(ElementId, uri).then(
									// setData(removeRow(id, tmpData))
								);
							}}
						>
							Add
						</Button>
					);
				}
			};

		let tmpData = {};
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
					return buttonAction(cellData);
					// return "uwu";
				},
			},
		];

		tmpData = {
			rows,
			columns,
		};
		// setData(tmpData);
	// }, [songList, ElementId, action]);

	return tmpData;
};







export const PlaylistTemplate = ({ data }) => {
	const theme = createTheme();
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