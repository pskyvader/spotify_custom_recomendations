import { useEffect, useState, useContext } from "react";
import { CircularProgress } from "@mui/material";
import {
	FormatSongList,
	FormatSongListColumns,
} from "../../../modules/FormatSongs";
import { subtractById, objectToList } from "../../../utils";
import { Playlist, Recommended } from "../../../API";
import { SongListTemplate, ButtonAdd } from "../../../modules/SongsView";
import { PlaylistContext } from "../../../modules/PlaylistContextProvider";

const RecommendedSongsTemplate = ({ recommended, playlist, playlistId }) => {
	const recommendedSongs = FormatSongList(recommended.tracks);
	const playlistSongs = FormatSongList(playlist.tracks.items);
	const RemainingRecommendedSongs = subtractById(recommendedSongs,playlistSongs);

	const data = FormatSongListColumns(RemainingRecommendedSongs, playlistId, ButtonAdd);
	return <SongListTemplate data={data} title="Recommended" />;
};

const RecommendedSongs = () => {
	const [playlist, setPlaylist] = useState(<CircularProgress />);
	const { playlistId } = useContext(PlaylistContext);
	useEffect(() => {
		setPlaylist(<CircularProgress />);
		if (playlistId === null) {
			return;
		}
		Playlist.Playlist(playlistId)
			.then((playlist) => {
				Recommended.Recommended(playlist)
					.then((response) => {
						if (response.error) {
							setPlaylist(objectToList(response));
							console.log("PlayListSongs", playlistId,response);
						} else {
							setPlaylist(
								<RecommendedSongsTemplate
									recommended={response}
									playlist={playlist}
									playlistId={playlistId}
								/>
							);
						}
					})
					.catch((e) => console.log(e));
			})
			.catch((e) => console.log(e));
	}, [playlistId]);
	return playlist;
};

export default RecommendedSongs;
