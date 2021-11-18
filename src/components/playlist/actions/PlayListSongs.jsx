import { useEffect, useState,useContext } from "react";
import { CircularProgress } from "@mui/material";
import { objectToList } from "../../../utils";
import { Playlist } from "../../../API";
import {
	FormatSongList,
	FormatSongListColumns,
} from "../../../modules/FormatSongs";
import { PlaylistTemplate, ButtonRemove } from "../../../modules/SongList";
import PlaylistContext from "../../../modules/PlaylistContext";


const PlayListSongsTemplate = ({ response, playlistId }) => {
	const songList = FormatSongList(response.tracks.items);
	const data = FormatSongListColumns(songList, playlistId, ButtonRemove);
	return <PlaylistTemplate data={data} />;
};

const PlayListSongs = () => {
	const [playlist, setPlaylist] = useState(<CircularProgress />);

	const playlistId  = useContext(PlaylistContext);

	useEffect(() => {
		if (playlistId === 0) {
			return false;
		}
		Playlist.Playlist(playlistId)
			.then((response) => {
				if (response.error) {
					setPlaylist(objectToList(response));
					console.log("PlayListSongs", playlistId);
				} else {
					setPlaylist(
						<PlayListSongsTemplate
							response={response}
							playlistId={playlistId}
						/>
					);
				}
			})
			.catch((e) => console.log(e));
	}, [playlistId]);
	return playlist;
};

export default PlayListSongs;
