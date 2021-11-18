import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import { objectToList } from "../../../utils";
import { Playlist } from "../../../API";
import {
	FormatSongList,
	FormatSongListColumns,
} from "../../../modules/FormatSongList";
import { PlaylistTemplate } from "../../../modules/SongList";

const PlayListSongsTemplate = ({ response }) => {
	const songList = FormatSongList(response.tracks.items);
	const data = FormatSongListColumns(songList, response.id, "delete");
	return <PlaylistTemplate data={data} />;
};

const PlayListSongs = ({ id }) => {
	const [playlist, setPlaylist] = useState(<CircularProgress />);
	useEffect(() => {
		if (id === null) {
			return false;
		}
		Playlist.Playlist(id)
			.then((response) => {
				if (response.error) {
					setPlaylist(objectToList(response));
					console.log("PlayListSongs", id);
				} else {
					setPlaylist(<PlayListSongsTemplate response={response} />);
				}
			})
			.catch((e) => console.log(e));
	}, [id]);
	return playlist;
};

export default PlayListSongs;
