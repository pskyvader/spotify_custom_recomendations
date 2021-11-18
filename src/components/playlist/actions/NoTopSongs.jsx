import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import {
	FormatSongList,
	FormatSongListColumns,
} from "../../../modules/FormatSongs";
import { subtractById, objectToList } from "../../../utils";
import { Playlist, Me } from "../../../API";
import { PlaylistTemplate, ButtonAdd } from "../../../modules/SongList";

const NoTopSongsTemplate = ({ top, playlist, playlistId }) => {
	const topSongs = FormatSongList(top.items);
	const playlistSongs = FormatSongList(playlist.tracks.items);
	const notTopsongs = subtractById(playlistSongs, topSongs);
	const data = FormatSongListColumns(notTopsongs, playlistId, ButtonAdd);
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
									playlistId={id}
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
