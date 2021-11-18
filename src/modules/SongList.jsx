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

export const ButtonAdd = ({ ElementId, uri }) => {
	return (
		<Button
			onClick={() => {
				Playlist.AddSong(ElementId, uri).then();
			}}
		>
			Add
		</Button>
	);
};

export const ButtonRemove = ({ ElementId, uri, id }) => {
	return (
		<Button
			onClick={() => {
				Playlist.DeleteSong(ElementId, uri).then();
			}}
		>
			Remove
		</Button>
	);
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
