import { useContext } from "react";
import { CircularProgress } from "@mui/material";
import { Playlist } from "../../API";
import ButtonAddSong from "../../components/ButtonAddSong";
import { PlaylistContext } from "../../context/PlaylistContextProvider";

import SongList, { SongListColumns } from "../../components/SongList";

const AddSongs = ({ playlistId }) => {
	const { playlistRecommendedTracks, setPlaylistRecommendedTracks } =
		useContext(PlaylistContext);

	if (playlistId === null) {
		return null;
	}
	if (playlistRecommendedTracks[playlistId]) {
		const data = SongListColumns(
			playlistRecommendedTracks[playlistId],
			playlistId,
			ButtonAddSong
		);
		return <SongList data={data} />;
	}

	Playlist.PlaylistReccomended(playlistId).then((response) => {
		if (response.error) return console.log(response);
		const newtracks = {};
		newtracks[playlistId] = response;
		setPlaylistRecommendedTracks({
			...newtracks,
			...playlistRecommendedTracks,
		});
	});

	return <CircularProgress />;
};

export default AddSongs;
