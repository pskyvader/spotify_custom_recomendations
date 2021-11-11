import { useState, useEffect } from "react";
import { CircularProgress } from "@mui/material";

import { MeTop } from "./API/Me";
import { objectToList, subtractById } from "./Utils";
import Playlist from "./API/Playlist";

const PlaylistActionsTemplate = ({ top, playlist }) => {
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

	const notTopsongs = subtractById(playlistSongs,topSongs);
	console.log(notTopsongs);

	return objectToList(topSongs);
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
						<PlaylistActionsTemplate
							response={response}
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
