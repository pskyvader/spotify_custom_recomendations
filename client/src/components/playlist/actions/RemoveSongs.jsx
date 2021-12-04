import { useEffect, useState, useContext } from "react";
import { CircularProgress } from "@mui/material";
import {
	FormatSongList,
	FormatSongListColumns,
} from "../../../modules/FormatSongs";
import { subtractById, objectToList } from "../../../utils";
import { Playlist, Me } from "../../../API";
import { SongListTemplate, ButtonRemove } from "../../../modules/SongsView";
import { PlaylistContext } from "../../../context/PlaylistContextProvider";

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
		const fromDate = 0;
		setPlaylist(<CircularProgress />);
		if (playlistId === null) {
			return;
		}
		Playlist.Playlist(playlistId).then((playlist) => {
			if (playlist.error) return setPlaylist(objectToList(playlist));
			paginatedRecentsList(fromDate, fromDate + 1, setPlaylist, []).then(
				(recentslist) => {
					if (recentslist.error)
						return setPlaylist(objectToList(recentslist));
					setPlaylist(
						<RemoveSongsTemplate
							recent={recentslist[0]}
							playlist={playlist}
							playlistId={playlistId}
						/>
					);
				}
			);
		});
	}, [playlistId]);
	return playlist;
};

const paginatedRecentsList = (
	fromDate,
	afterDate,
	setPlaylist,
	recentsList = []
) => {
	return Me.MeRecently(afterDate).then((recent) => {
		if (recent.error) return recent;
		recentsList.push(recent);
		if (recent.cursors) {
			return paginatedRecentsList(
				fromDate,
				recent.cursors.after,
				setPlaylist,
				recentsList
			);
		}
		return recentsList;
	});
};

export default RemoveSongs;
