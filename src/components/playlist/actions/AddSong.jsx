import { Box } from "@mui/system";

import { objectToList, subtractById } from "../../../utils";

const AddSong = ({ top, playlist }) => {
	const topSongs = top.items.map((song) => ({
		id: song.id,
		href: song.href,
		name: song.name,
	}));
	const playlistSongs = playlist.tracks.items.map((song) => ({
		id: song.track.id,
		href: song.track.href,
		name: song.track.name,
	}));

	const notTopsongs = subtractById(playlistSongs, topSongs);

	return (
		<Box sx={{ height: "100%", flexGrow: 12, overflow: "auto" }}>
			{objectToList(notTopsongs)}
		</Box>
	);
};

export default AddSong;
