import { useContext } from "react";
import { CircularProgress } from "@mui/material";
import { Playlist } from "../../API";
import SongList, { SongListColumns } from "../../components/SongList";
import ButtonRemoveSong from "../../components/ButtonRemoveSong";
import { PlaylistContext } from "../../context/PlaylistContextProvider";

const PlayListSongs = ({ playlistId }) => {
	const { playlistTracks, setPlaylistTracks } = useContext(PlaylistContext);

	if (playlistId === null) {
		return null;
	}

	if (playlistTracks[playlistId]) {
		const data = SongListColumns(
			playlistTracks[playlistId],
			playlistId,
			ButtonRemoveSong
		);
		return <SongList data={data} />;
	}

	Playlist.Playlist(playlistId).then((response) => {
		if (response.error) return console.log(response);
		const newtracks = {};
		newtracks[playlistId] = response;
		setPlaylistTracks({ ...newtracks, ...playlistTracks });
	});

	return <CircularProgress />;
};

export default PlayListSongs;
