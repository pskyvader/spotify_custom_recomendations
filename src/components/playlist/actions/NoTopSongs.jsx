import { useEffect, useState,useContext } from "react";
import { CircularProgress } from "@mui/material";
import {
	FormatSongList,
	FormatSongListColumns,
} from "../../../modules/FormatSongs";
import { subtractById, objectToList } from "../../../utils";
import { Playlist, Me } from "../../../API";
import { PlaylistTemplate, ButtonAdd } from "../../../modules/SongList";
import {PlaylistContext} from "../../../modules/PlaylistContextProvider";

const NoTopSongsTemplate = ({ top, playlist, playlistId }) => {
	const topSongs = FormatSongList(top.items);
	const playlistSongs = FormatSongList(playlist.tracks.items);
	const notTopsongs = subtractById(playlistSongs, topSongs);
	const data = FormatSongListColumns(notTopsongs, playlistId, ButtonAdd);
	return <PlaylistTemplate data={data} />;
};

const NoTopSongs = () => {
	const [playlist, setPlaylist] = useState(<CircularProgress />);
	const {playlistId}  = useContext(PlaylistContext);
	useEffect(() => {
		if (playlistId === null) {
			return;
		}
		Playlist.Playlist(playlistId)
			.then((playlist) => {
				Me.MeTop()
					.then((response) => {
						if (response.error) {
							setPlaylist(objectToList(response));
							console.log("PlayListSongs", playlistId);
						} else {
							setPlaylist(
								<NoTopSongsTemplate
									top={response}
									playlist={playlist}
									playlistId={playlistId}
								/>
							);
						}
					})
					.catch((e) => console.log(e));
			})
			.catch((e) => console.log(e));
	}, [playlistId]);
	return playlist;
};

export default NoTopSongs;
