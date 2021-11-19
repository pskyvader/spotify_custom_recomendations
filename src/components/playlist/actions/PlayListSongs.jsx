import { useEffect, useState, useContext } from "react";
import { CircularProgress } from "@mui/material";
import { objectToList } from "../../../utils";
import { Playlist } from "../../../API";
import {
	FormatSongList,
	FormatSongListColumns,
} from "../../../modules/FormatSongs";
import { SongListTemplate, ButtonRemove } from "../../../modules/SongsView";
import { PlaylistContext } from "../../../modules/PlaylistContextProvider";

const PlayListSongsTemplate = ({ response, playlistId }) => {
	const songList = FormatSongList(response.tracks.items);
	const data = FormatSongListColumns(songList, playlistId, ButtonRemove);
	return <SongListTemplate data={data} title={response.name}/>;
};

const PlayListSongs = () => {
	const [playlist, setPlaylist] = useState(<CircularProgress />);
	const { playlistId } = useContext(PlaylistContext);

	useEffect(() => {
		setPlaylist(<CircularProgress />);
		if (playlistId === null) {
			return;
		}
		Playlist.Playlist(playlistId)
			.then((response) => {
				if (response.error) {
					setPlaylist(objectToList(response));
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
