import GetRequest from "./Request";
import {
	genres
} from "../utils";

const fillOptions = (playlist, topSongs, currentgenres) => {
	const options = {
		seed_artists: [],
		seed_genres: [],
		seed_tracks: [],
	};
	const songs =
		playlist.tracks.items.length > 0 ? playlist.tracks.items : topSongs.items;

	if (songs.length > 0) {
		for (let index = 0; index < 5; index++) {
			const idsong = Math.floor(Math.random() * songs.length);
			const currentSong = songs[idsong].track || songs[idsong];
			switch (Math.floor(Math.random() * 3)) {
				case 0:
					options.seed_artists.push(currentSong.artists[0].id);
					break;
				case 1:
					options.seed_tracks.push(currentSong.id);
					break;
				default:
					options.seed_genres.push(
						currentgenres[
							Math.floor(Math.random() * currentgenres.length)
						]
					);
					break;
			}
		}
	} else {
		for (let index = 0; index < 5; index++) {
			options.seed_genres.push(
				currentgenres[Math.floor(Math.random() * currentgenres.length)]
			);
		}
	}

	return options;
};

export const Recommended = async (playlist, topSongs, currentgenres) => {
	const options = fillOptions(playlist, topSongs, currentgenres || genres);

	const url = "https://api.spotify.com/v1/recommendations";
	let urlOptions = "?";
	Object.entries(options).forEach((option) => {
		urlOptions += option[0] + "=" + option[1] + "&";
	});
	return GetRequest(url + urlOptions);
};