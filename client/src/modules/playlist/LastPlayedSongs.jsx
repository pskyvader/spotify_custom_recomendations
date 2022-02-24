import { useContext, useEffect } from "react";
import { CircularProgress } from "@mui/material";
import { Playlist } from "../../API";
import SongList, { SongListColumns } from "../../components/SongList";
import { PlaylistContext } from "../../context/PlaylistContextProvider";

const LastPlayedSongs = ({ hidden }) => {
	const { lastPlayedTracks, setLastPlayedTracks } =
		useContext(PlaylistContext);
	useEffect(() => {
		if (!lastPlayedTracks) {
			Playlist.LastPlayed().then((response) => {
				if (response.error) return console.log(response);
				setLastPlayedTracks(response);
			});
		}
	}, [lastPlayedTracks, setLastPlayedTracks]);

	if (hidden) {
		return null;
	}
	if (lastPlayedTracks) {
		const data = SongListColumns(lastPlayedTracks, null, null);
		return <SongList data={data} title="Last Played Songs" />;
	}
	return <CircularProgress />;
};
export default LastPlayedSongs;
