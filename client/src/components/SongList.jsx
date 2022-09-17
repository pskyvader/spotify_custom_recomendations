import { Toolbar, Typography } from "@mui/material";
import { GridOverlay, DataGrid } from "@mui/x-data-grid";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import ListItemText from "@mui/material/ListItemText";

const renderTitle = (cellData) => {
	return (
		<Stack direction="row" spacing={2}>
			<Avatar src={cellData.row.image} />
			<ListItemText
				primary={cellData.row.name}
				secondary={cellData.row.artist}
			/>
		</Stack>
	);
};

export const SongListColumns = (
	rows,
	PlaylistId = null,
	ActionButton = null
) => {
	const renderActionButton = (cellData) => {
		const uri = cellData.formattedValue;
		return <ActionButton PlaylistId={PlaylistId} uri={uri} />;
	};
	const columns = [
		{
			field: "name",
			headerName: "Title",
			minWidth: 200,
			flex: 1,
			renderCell: renderTitle,
		},
		{ field: "album", headerName: "Album", minWidth: 200, flex: 1 },
	];

	if (PlaylistId !== null && ActionButton !== null) {
		columns.push({
			field: "uri",
			headerName: "",
			minWidth: 120,
			flex: 1,
			renderCell: renderActionButton,
		});
	}

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
			density="comfortable"
			pageSize={100}
			rowsPerPageOptions={[10, 25, 50, 100]}
			disableSelectionOnClick
			components={{
				Toolbar: () => {
					return (
						<Toolbar variant="comfortable">
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
