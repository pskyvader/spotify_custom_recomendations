import { ListItem, Toolbar, Typography } from "@mui/material";
import { GridOverlay, DataGrid } from "@mui/x-data-grid";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import ListItemText from "@mui/material/ListItemText";
import FolderIcon from "@mui/icons-material/Folder";

const renderTitle = (cellData, setCurrentSong = null) => {
	const playSong = () => {
		if (setCurrentSong !== null) {
			setCurrentSong(cellData.row);
		}
	};

	return (
		<>
			<Stack direction="row" spacing={2} useFlexGap sx={{ flexWrap: 'wrap' }}>
				<Avatar src={cellData.row.image} onClick={playSong}>
					<FolderIcon />
				</Avatar>
				<ListItemText
					primary={cellData.row.name}
					secondary={cellData.row.artist}
				/>
			</Stack>
			{/* <Stack>
				<ListItem>
					{cellData.row.id}
				</ListItem>
			</Stack> */}
		</>
	);
};

export const SongListColumns = (
	rows,
	PlaylistId = null,
	ActionButton = null,
	setCurrentSong = null
) => {
	const renderActionButton = (cellData) => {
		const uri = cellData.formattedValue;
		return <ActionButton PlaylistId={PlaylistId} uri={uri} />;
	};
	const columns = [
		{ field: "", headerName: "ID", minWidth: 100, flex: 1, resizable: true, renderCell: (cellData) => cellData.row.id},
		{ field: "name", headerName: "Title", minWidth: 200, flex: 1, resizable: true, renderCell: (cellData) => renderTitle(cellData, setCurrentSong), },
		{ field: "album", headerName: "Album", minWidth: 100, flex: 1 },
	];

	if (PlaylistId !== null && ActionButton !== null) {
		columns.push({
			field: "id",
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
			autoHeight={true}
			// disableExtendRowFullWidth
			// getRowHeight={() => 'auto'}
		/>
	);
};

export default SongList;
