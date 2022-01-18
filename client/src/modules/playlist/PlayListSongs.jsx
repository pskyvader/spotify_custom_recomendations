import { useContext, useEffect } from "react";
import { CircularProgress } from "@mui/material";
import { Playlist } from "../../API";
import SongList, { SongListColumns } from "../../components/SongList";
import ButtonRemoveSong from "../../components/ButtonRemoveSong";
import { PlaylistContext } from "../../context/PlaylistContextProvider";
const PlayListSongs = ({ playlistId }) => {
	const { playlistTracks, setPlaylistTracks } = useContext(PlaylistContext);
	// useEffect(() => {
		if (playlistId !== null && !playlistTracks[playlistId]) {
			Playlist.Playlist(playlistId).then((response) => {
				if (response.error) return console.log(response);
				playlistTracks[playlistId] = response;
				setPlaylistTracks({ ...playlistTracks });
			});
		}
	// }, [playlistId, playlistTracks, setPlaylistTracks]);

	if (playlistId === null) {
		return null;
	}
	if (playlistTracks[playlistId]) {
		const data = SongListColumns(
			playlistTracks[playlistId],
			playlistId,
			ButtonRemoveSong
		);
		return <SongList data={data} title="Playlist songs" />;
	}
	return <CircularProgress />;
};
export default PlayListSongs;
