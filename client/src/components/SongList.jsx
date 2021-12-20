import { Toolbar, Typography } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { Box } from "@mui/system";
import { GridOverlay, DataGrid } from "@mui/x-data-grid";


export const SongListColumns = (rows, PlaylistId, ActionButton) => {
	// const rows = songList;
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
					<ActionButton PlaylistId={PlaylistId} uri={uri} id={id} />
				);
			},
		},
	];
	return {
		rows,
		columns,
	};
};


const SongList = ({ data, title = "title" }) => {
	const theme = createTheme();
	return (
		<Box sx={{ height: "100%", padding: theme.spacing() }}>
			<DataGrid
				hideFooter
				disableSelectionOnClick
				components={{
					Toolbar: () => {
						return (
							<Toolbar variant="dense">
								<Typography
									variant="h6"
									component="div"
									sx={{ flexGrow: 1 }}
								>
									{title}
								</Typography>
							</Toolbar>
						);
					},
					NoRowsOverlay: () => {
						return (
							<GridOverlay>No songs in this playlist</GridOverlay>
						);
					},
				}}
				{...data}
				columnBuffer={2}
				columnThreshold={2}
				// disableExtendRowFullWidth
			/>
		</Box>
	);
};

export default SongList;