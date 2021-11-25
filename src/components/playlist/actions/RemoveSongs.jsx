import { useEffect, useState, useContext } from "react";
import { CircularProgress } from "@mui/material";
import {
	FormatSongList,
	FormatSongListColumns,
} from "../../../modules/FormatSongs";
import { subtractById, objectToList } from "../../../utils";
import { Playlist, Me } from "../../../API";
import { SongListTemplate, ButtonRemove } from "../../../modules/SongsView";
import { PlaylistContext } from "../../../modules/PlaylistContextProvider";
import GetRequest from "../../../API/Request";

const RemoveSongsTemplate = ({ recent, playlist, playlistId }) => {
	const recentSongs = FormatSongList(recent.items);
	const playlistSongs = FormatSongList(playlist.tracks.items);
	const RemoveRecommendedSongs = subtractById(playlistSongs, recentSongs);

	const data = FormatSongListColumns(
		RemoveRecommendedSongs,
		playlistId,
		ButtonRemove
	);
	return <SongListTemplate data={data} title="Recommended to Remove" />;
};

const RemoveSongs = () => {
	const [playlist, setPlaylist] = useState(<CircularProgress />);
	const { playlistId } = useContext(PlaylistContext);
	useEffect(() => {
		const fromDate = Date.now() - 604800000;
		setPlaylist(<CircularProgress />);
		if (playlistId === null) {
			return;
		}
		Playlist.Playlist(playlistId)
			.then((playlist) => {
				if (playlist.error) return setPlaylist(objectToList(playlist));
				paginatedRecentsList( fromDate, fromDate + 1, setPlaylist, [] ).then((recentslist) => {
					if (recentslist.error)
						return setPlaylist(objectToList(recentslist));
					setPlaylist(
						<RemoveSongsTemplate
							recent={recentslist[0]}
							playlist={playlist}
							playlistId={playlistId}
						/>
					);
				});
			})
			.catch((e) => console.log(e));
	}, [playlistId]);
	return playlist;
};

const paginatedRecentsList = ( fromDate, beforedate, setPlaylist, recentsList = [] ) => {
    console.log(fromDate, beforedate,beforedate-fromDate);
	return Me.MeRecently(beforedate).then((recent) => {
		if (recent.error) return recent;
		recentsList.push(recent);
		if (recent.cursors && recent.cursors.before > fromDate) {
			return paginatedRecentsList(
				fromDate,
				recent.cursors.before,
				setPlaylist,
				recentsList
			);
		}
		return recentsList;
	});
};

export default RemoveSongs;
