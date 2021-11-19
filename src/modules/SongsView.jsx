import { Button } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { Box } from "@mui/system";
import { GridOverlay, DataGrid } from "@mui/x-data-grid";
import { Playlist } from "../API";
import { useContext } from "react";
import { PlaylistContext } from "./PlaylistContextProvider";

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
				Playlist.DeleteSong(PlaylistId, uri).then(
					setPlaylistId(PlaylistId)
				);
			}}
		>
			Remove
		</Button>
	);
};

export const SongListTemplate = ({ data, Title="uwu" }) => {
	const theme = createTheme();
	return (
		<Box sx={{ height: "100%", padding: theme.spacing() }}>
			<h4>{Title}</h4>
			<DataGrid
				hideFooter
				disableSelectionOnClick
				components={{
					NoRowsOverlay: () => {
						return (
							<GridOverlay>No songs in this playlist</GridOverlay>
						);
					},
				}}
				{...data}
				columnBuffer={2}
				columnThreshold={2}
				disableExtendRowFullWidth
			/>
		</Box>
	);
};
