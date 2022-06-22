import { Toolbar, Typography } from "@mui/material";
import { GridOverlay, DataGrid } from "@mui/x-data-grid";

export const SongListColumns = (rows, PlaylistId, ActionButton) => {
	const renderCell =
		PlaylistId !== null && ActionButton !== null
			? (cellData) => {
					const id = cellData.id;
					const uri = cellData.formattedValue;
					return (
						<ActionButton
							PlaylistId={PlaylistId}
							uri={uri}
							id={id}
						/>
					);
			  }
			: null;

	const columns = [
		// { field: "id", headerName: "#", minWidth: 40, flex: 0.1 },
		{ field: "name", headerName: "Title", minWidth: 200, flex: 1 },
		{ field: "artist", headerName: "Artist", minWidth: 200, flex: 1 },
		{ field: "album", headerName: "Album", minWidth: 200, flex: 1 },
		{
			field: "action",
			headerName: "",
			minWidth: 120,
			flex: 1,
			renderCell: renderCell,
		},
	];

	return {
		rows,
		columns,
	};
};


const SongList = ({ data, title = "title" }) => {
	return (
		<DataGrid
			// autoPageSize={true}
			// hideFooter
			// pageSize={20}
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
								{title} - {data.rows.length}
							</Typography>
						</Toolbar>
					);
				},
				NoRowsOverlay: () => {
					return <GridOverlay>No songs in this playlist</GridOverlay>;
				},
			}}
			{...data}
			columnBuffer={2}
			columnThreshold={2}
			// autoHeight={true}
			// disableExtendRowFullWidth
		/>
	);
};

export default SongList;
