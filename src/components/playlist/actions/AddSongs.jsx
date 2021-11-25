import { useEffect, useState, useContext } from "react";
import { CircularProgress } from "@mui/material";
import {
	FormatSongList,
	FormatSongListColumns,
} from "../../../modules/FormatSongs";
import { subtractById, objectToList } from "../../../utils";
import { Playlist, Recommended, Me } from "../../../API";
import { SongListTemplate, ButtonAdd } from "../../../modules/SongsView";
import { PlaylistContext } from "../../../modules/PlaylistContextProvider";

const AddSongsTemplate = ({ recommended, playlist, playlistId }) => {
	const recommendedSongs = FormatSongList(recommended.tracks);
	const playlistSongs = FormatSongList(playlist.tracks.items);
	const AddRecommendedSongs = subtractById(
		recommendedSongs,
		playlistSongs
	);

	const data = FormatSongListColumns(
		AddRecommendedSongs,
		playlistId,
		ButtonAdd
	);
	return <SongListTemplate data={data} title="Recommended to Add" />;
};

const AddSongs = () => {
	const [playlist, setPlaylist] = useState(<CircularProgress />);
	const { playlistId } = useContext(PlaylistContext);
	useEffect(() => {
		setPlaylist(<CircularProgress />);
		if (playlistId === null) {
			return;
		}
		Playlist.Playlist(playlistId)
			.then((playlist) => {
				if (playlist.error) return setPlaylist(objectToList(playlist));
				Me.MeTop().then((topSongs) => {
					if (topSongs.error) return setPlaylist(objectToList(topSongs));
					Recommended.Recommended(playlist, topSongs)
						.then((response) => {
							if (response.error) return setPlaylist(objectToList(response));
							setPlaylist(
								<AddSongsTemplate
									recommended={response}
									playlist={playlist}
									playlistId={playlistId}
								/>
							);
						})
						.catch((e) => console.log(e));
				});
			})
			.catch((e) => console.log(e));
	}, [playlistId]);
	return playlist;
};

export default AddSongs;
