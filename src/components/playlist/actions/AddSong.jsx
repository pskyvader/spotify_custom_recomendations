import { Box } from "@mui/system";
import { DataGrid } from "@mui/x-data-grid";
import { createTheme } from "@mui/material/styles";

import ElementList from "../../../modules/SongList";
import FormatSongList from "../../../modules/FormatSongList";
import { subtractById } from "../../../utils";

const AddSong = ({ top, playlist }) => {
	// const topSongs = top.items.map((song) => ({
	// 	id: song.id,
	// 	href: song.href,
	// 	name: song.name,
	// }));
	const topSongs=FormatSongList(top.items);
	// const playlistSongs = playlist.tracks.items.map((song) => ({
	// 	id: song.track.id,
	// 	href: song.track.href,
	// 	name: song.track.name,
	// }));
	const playlistSongs=FormatSongList(playlist.tracks.items);

	const notTopsongs = subtractById(playlistSongs, topSongs);


	return <PlaylistTemplate songList={notTopsongs} id={playlist.id}/>;
};

const PlaylistTemplate = ({ songList,id }) => {
	const theme = createTheme();
	const data = ElementList(songList, id, "add");
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

export default AddSong;
