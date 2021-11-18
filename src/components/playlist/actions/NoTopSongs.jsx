import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import {
	FormatSongList,
	FormatSongListColumns,
} from "../../../modules/FormatSongList";
import { subtractById, objectToList } from "../../../utils";
import { Playlist, Me } from "../../../API";
import { PlaylistTemplate } from "../../../modules/SongList";

const NoTopSongsTemplate = ({ top, playlist }) => {
	const topSongs = FormatSongList(top.items);
	const playlistSongs = FormatSongList(playlist.tracks.items);
	const notTopsongs = subtractById(playlistSongs, topSongs);
	const data = FormatSongListColumns(notTopsongs, playlist.id, "add");
	return <PlaylistTemplate data={data} />;
};

const NoTopSongs = ({ id }) => {
	const [playlist, setPlaylist] = useState(<CircularProgress />);
	useEffect(() => {
		if (id === null) {
			return;
		}
		Playlist.Playlist(id)
			.then((playlist) => {
				Me.MeTop()
					.then((response) => {
						if (response.error) {
							setPlaylist(objectToList(response));
							console.log("PlayListSongs", id);
						} else {
							setPlaylist(
								<NoTopSongsTemplate
									top={response}
									playlist={playlist}
								/>
							);
						}
					})
					.catch((e) => console.log(e));
			})
			.catch((e) => console.log(e));
	}, [id]);
	return playlist;
};

export default NoTopSongs;
