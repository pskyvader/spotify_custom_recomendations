import { useEffect, useState, useContext } from "react";
import { CircularProgress } from "@mui/material";
import { objectToList } from "../../../utils";
import { Playlist } from "../../../API";
import {
	FormatSongList,
	FormatSongListColumns,
} from "../../../modules/FormatSongs";
import { SongListTemplate, ButtonRemove } from "../../../modules/SongsView";
import { PlaylistContext } from "../../../context/PlaylistContextProvider";

const PlayListSongsTemplate = ({ CurrentPlaylist, playlistId }) => {
	const { playlistTracks, setPlaylistTracks } = useContext(PlaylistContext);

	console.log("PlayListSongsTemplate")

	useEffect(() => {
		if(!playlistTracks[playlistId]){
			const newtracks ={};
			newtracks[playlistId] = CurrentPlaylist;
			console.log(newtracks);
			setPlaylistTracks({...newtracks,...playlistTracks});
		}
	})
	
	const data = FormatSongListColumns(
		CurrentPlaylist,
		playlistId,
		ButtonRemove
	);
	return <SongListTemplate data={data} />;
};

const PlayListSongs = ({ playlistId }) => {
	const { playlistTracks, setPlaylistTracks } = useContext(PlaylistContext);
	const [playlist, setPlaylist] = useState(<CircularProgress />);

	useEffect(() => {
		setPlaylist(<CircularProgress />);
		if (playlistId === null) {
			return;
		}
		if (playlistTracks[playlistId]) {
			setPlaylist(
				<PlayListSongsTemplate
					CurrentPlaylist={playlistTracks[playlistId]}
					playlistId={playlistId}
				/>
			);
		}

		Playlist.Playlist(playlistId).then((response) => {
			if (response.error) return setPlaylist(objectToList(response));
			setPlaylist(
				<PlayListSongsTemplate
					respoCurrentPlaylistnse={response}
					playlistId={playlistId}
				/>
			);
		});
	}, [playlistId, playlistTracks, setPlaylistTracks]);

	return playlist;
};

export default PlayListSongs;
