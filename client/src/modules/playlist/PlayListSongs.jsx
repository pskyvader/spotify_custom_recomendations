import { useContext, useEffect } from "react";
import { CircularProgress } from "@mui/material";
import { Playlist } from "../../API";
import SongList, { SongListColumns } from "../../components/SongList";
import ButtonRemoveSong from "../../components/ButtonRemoveSong";
import { PlaylistContext } from "../../context/PlaylistContextProvider";
import { PlayerContext } from "../../context/PlayerContextProvider";
const PlayListSongs = ({ playlistId, hidden }) => {
	const { playlistTracks, setPlaylistTracks } = useContext(PlaylistContext);
	const { setCurrentSong } = useContext(PlayerContext);
	useEffect(() => {
		if (!hidden && !playlistTracks[playlistId]) {
			Playlist.Playlist(playlistId).then((response) => {
				if (response.error) return console.log(response);
				playlistTracks[playlistId] = response;
				setPlaylistTracks({ ...playlistTracks });
			});
		}
	}, [hidden, playlistId, playlistTracks, setPlaylistTracks]);
	if (playlistId === null) {
		return null;
	}
	if (hidden) {
		return null;
	}
	if (playlistTracks[playlistId]) {
		const data = SongListColumns(
			playlistTracks[playlistId],
			playlistId,
			ButtonRemoveSong,
			setCurrentSong
		);
		return <SongList data={data} title="Playlist songs" />;
	}
	return <CircularProgress />;
};
export default PlayListSongs;
