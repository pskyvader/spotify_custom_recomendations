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
        let beforedate=fromDate+1;
		setPlaylist(<CircularProgress />);
		if (playlistId === null) {
			return;
		}
		Playlist.Playlist(playlistId)
			.then((playlist) => {
				if (playlist.error) return setPlaylist(objectToList(playlist));
                let recentsList = [];
                while(beforedate>fromDate){
                    const next=Me.MeRecently(beforedate);
                    console.log(next());
                    beforedate=0;
                }

				// Me.MeRecently(fromDate).then((recent) => {
				// 	if (recent.error) return setPlaylist(objectToList(recent));
                //     let recentsList = [recent];
				// 	if (recent.cursors && recent.cursors.before > fromDate) {
				// 		Me.MeRecently(recent.cursors.before).then((next) => {
                //             if (next.error) return setPlaylist(objectToList(next));
				// 			recentsList.push(next);
				// 			console.log(recentsList,fromDate);
				// 			setPlaylist(
				// 				<RemoveSongsTemplate
				// 					recent={recent}
				// 					playlist={playlist}
				// 					playlistId={playlistId}
				// 				/>
				// 			);
				// 		});
				// 	}
				// });
			})
			.catch((e) => console.log(e));
	}, [playlistId]);
	return playlist;
};

export default RemoveSongs;
