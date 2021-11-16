import { useState, useEffect } from "react";
import { CircularProgress } from "@mui/material";

import Playlist from "../../../API/Playlist";
import { MeTop } from "../../../API/Me";
import AddSong from "./AddSong";

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
						<AddSong
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
