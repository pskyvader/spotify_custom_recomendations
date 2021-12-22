import { useContext } from "react";
import { CircularProgress } from "@mui/material";
import { Playlist } from "../../API";
import SongList, { SongListColumns } from "../../components/SongList";
import ButtonRemoveSong from "../../components/ButtonRemoveSong";
import { PlaylistContext } from "../../context/PlaylistContextProvider";

const RecommendedDeleteSongs = ({ playlistId }) => {
	const { playlistDeleteTracks, setPlaylistDeleteTracks } =
		useContext(PlaylistContext);

	if (playlistId === null) {
		return null;
	}
	if (playlistDeleteTracks[playlistId]) {
		const data = SongListColumns(
			playlistDeleteTracks[playlistId],
			playlistId,
			ButtonRemoveSong
		);
		return <SongList data={data} />;
	}

	Playlist.PlaylistDeleteRecommended(playlistId).then((response) => {
		if (response.error) return console.log(response);
		const newtracks = {};
		newtracks[playlistId] = response;
		setPlaylistDeleteTracks({ ...newtracks, ...playlistDeleteTracks });
	});
	return <CircularProgress />;
};

export default RecommendedDeleteSongs;
