import { useEffect, useState, useContext } from "react";
import { CircularProgress } from "@mui/material";
import {
	FormatSongList,
	FormatSongListColumns,
} from "../../../modules/FormatSongs";
import { subtractById, objectToList } from "../../../utils";
import { Playlist, Me } from "../../../API";
import { SongListTemplate, ButtonAdd } from "../../../modules/SongsView";
import { PlaylistContext } from "../../../modules/PlaylistContextProvider";

const NoTopSongsTemplate = ({ top, playlist, playlistId }) => {
	const topSongs = FormatSongList(top.items);
	const playlistSongs = FormatSongList(playlist.tracks.items);
	const notTopsongs = subtractById(playlistSongs, topSongs);
	const data = FormatSongListColumns(notTopsongs, playlistId, ButtonAdd);
	return <SongListTemplate data={data} title="No Top Songs" />;
};

const NoTopSongs = () => {
	const [playlist, setPlaylist] = useState(<CircularProgress />);
	const { playlistId } = useContext(PlaylistContext);
	useEffect(() => {
		setPlaylist(<CircularProgress />);
		if (playlistId === null) {
			return;
		}
		Playlist.Playlist(playlistId).then((playlist) => {
			if (playlist.error) return setPlaylist(objectToList(playlist));
			Me.MeTop().then((response) => {
				if (response.error) return setPlaylist(objectToList(response));
				setPlaylist(
					<NoTopSongsTemplate
						top={response}
						playlist={playlist}
						playlistId={playlistId}
					/>
				);
			});
		});
	}, [playlistId]);
	return playlist;
};

export default NoTopSongs;
