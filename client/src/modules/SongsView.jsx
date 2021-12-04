import { Button, Toolbar, Typography } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { Box } from "@mui/system";
import { GridOverlay, DataGrid } from "@mui/x-data-grid";
import { Playlist } from "../API";
import { useContext } from "react";
import { PlaylistContext } from "../context/PlaylistContextProvider";

export const ButtonAdd = ({ PlaylistId, uri }) => {
	const { setPlaylistId } = useContext(PlaylistContext);
	return (
		<Button
			onClick={() => {
				setPlaylistId(null);
				Playlist.AddSong(PlaylistId, uri).then(() => {
					setPlaylistId(PlaylistId);
				});
			}}
		>
			Add
		</Button>
	);
};

export const ButtonRemove = ({ PlaylistId, uri, id }) => {
	const { setPlaylistId } = useContext(PlaylistContext);
	return (
		<Button
			onClick={() => {
				setPlaylistId(null);
				Playlist.DeleteSong(PlaylistId, uri).then(() => {
					setPlaylistId(PlaylistId);
				});
			}}
		>
			Remove
		</Button>
	);
};

export const SongListTemplate = ({ data, title = "title" }) => {
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
