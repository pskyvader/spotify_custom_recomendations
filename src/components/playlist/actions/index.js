import { useState, useEffect } from "react";
import { CircularProgress } from "@mui/material";

import { Playlist } from "../../../API/";
// import { Me.MeTop } from "../../../API/";
import {Me} from "../../../API/";

import AddSong from "./AddSong";

const PlaylistActions = ({ id }) => {
	const [playlist, setPlaylist] = useState(<CircularProgress />);

	useEffect(() => {
		if (id === null) {
			return;
		}
		Playlist.Playlist(id).then((playlist) => {
			Me.MeTop()
				.then((response) => {
					if (response === null || response === undefined) {
						return;
					}
					setPlaylist(<AddSong top={response} playlist={playlist} />);
				})
				.catch((e) => console.log(e));
		});
	}, [id]);

	return playlist;
};

export default PlaylistActions;
