import { useState, useEffect } from "react";
import { CircularProgress } from "@mui/material";
import { Box } from "@mui/system";

import { MeTop } from "../../API/Me";
import { objectToList, subtractById } from "../../utils/Utils";
import Playlist from "../../API/Playlist";

const PlaylistAddSongsTemplate = ({ top, playlist }) => {
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
		<Box sx={{ height: "100%", flexGrow: 12,overflow:"auto" }}>
			{objectToList(notTopsongs)}
		</Box>
	);
};

const PlaylistActions = ({ id }) => {
	const [playlist, setPlaylist] = useState(<CircularProgress />);

	useEffect(() => {
		if (id === null) {
			return;
		}
		Playlist(id).then((playlist) => {
			MeTop()
				.then((response) => {
					if (response === null || response === undefined) {
						return;
					}
					setPlaylist(
						<PlaylistAddSongsTemplate
							top={response}
							playlist={playlist}
						/>
					);
				})
				.catch((e) => console.log(e));
		});
	}, [id]);

	return playlist;
};

export default PlaylistActions;
