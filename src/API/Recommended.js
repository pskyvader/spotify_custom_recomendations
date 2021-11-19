import GetRequest from "./Request";

const fillOptions = (playlist, genres) => {
	const options = {
		seed_artists: [],
		seed_genres: [],
		seed_tracks: [],
	};
	const songs = playlist.tracks.items;
	if (songs.length > 0) {
		for (let index = 0; index < 5; index++) {
			const currentSong =
				songs[Math.floor(Math.random() * songs.length)].track;
			switch (Math.floor(Math.random() * 3)) {
				case 0:
					options.seed_artists.push(currentSong.artists[0].id);
					break;
				case 1:
					options.seed_tracks.push(currentSong.id);
					break;
				default:
					options.seed_genres.push(
						genres[Math.floor(Math.random() * genres.length)]
					);
					break;
			}
		}
	} else {
		for (let index = 0; index < 5; index++) {
			options.seed_genres.push(
				genres[Math.floor(Math.random() * genres.length)]
			);
		}
	}

	return options;
};

export const Recommended = async (playlist, genres = ["pop", "disco"]) => {
	const options = fillOptions(playlist, genres);

	const url = "https://api.spotify.com/v1/recommendations";
	let urlOptions = "?";
	Object.entries(options).forEach((option) => {
		urlOptions += option[0] + "=" + option[1] + "&";
	});
	return GetRequest(url + urlOptions);
};
