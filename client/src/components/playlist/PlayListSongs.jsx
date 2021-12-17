import { useContext } from "react";
import { CircularProgress } from "@mui/material";
import { Playlist } from "../../API";
import { FormatSongListColumns } from "../../modules/FormatSongs";
import { SongListTemplate, ButtonRemove } from "../../modules/SongsView";
import { PlaylistContext } from "../../context/PlaylistContextProvider";

const PlayListSongsTemplate = ({ CurrentPlaylist, playlistId }) => {
	const data = FormatSongListColumns(
		CurrentPlaylist,
		playlistId,
		ButtonRemove
	);
	return <SongListTemplate data={data} />;
};

const PlayListSongs = ({ playlistId }) => {
	const { playlistTracks, setPlaylistTracks } = useContext(PlaylistContext);

	if (playlistId === null) {
		return null;
	}

	if (playlistTracks[playlistId]) {
		return (
			<PlayListSongsTemplate
				CurrentPlaylist={playlistTracks[playlistId]}
				playlistId={playlistId}
			/>
		);
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
