const { request, genres } = require("../../utils");
const { formatSongList } = require("../../model");

const fillOptions = (playlist, currentgenres) => {
	const options = {
		seed_artists: [],
		seed_genres: [],
		seed_tracks: [],
		market: "from_token",
	};

	if (playlist.length > 0) {
		const half_playlist = Math.floor((playlist.length - 1) / 2);
		for (let index = 0; index < 5; index++) {
			const idsong =
				half_playlist + Math.floor(Math.random() * half_playlist);
			const randomSong = playlist[idsong];
			const randomNumber = Math.floor(Math.random() * 10);

			//60%
			if (randomNumber < 6) {
				options.seed_tracks.push(randomSong.id);
				continue;
			}
			//30%
			if (randomNumber < 9) {
				options.seed_artists.push(randomSong.idartist);
				continue;
			}

			//10%
			const randomGenre =
				currentgenres[
					Math.floor(Math.random() * (currentgenres.length - 1))
				];
			options.seed_genres.push(randomGenre);
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

const myApiRecommended = async (
	access_token,
	playlist,
	currentgenres = genres
) => {
	const options = fillOptions(playlist, currentgenres);

	const url = "https://api.spotify.com/v1/recommendations";
	let urlOptions = "?";
	Object.entries(options).forEach((option) => {
		urlOptions += `${option[0]}=${option[1]}&`;
	});
	const response = await request(access_token, url + urlOptions);
	if (response.error) {
		return response;
	}

	const filtered = response.tracks.filter((song) => {
		const currentSong = song.track || song;

		//song playable and not in playlist
		return (
			currentSong.is_playable &&
			!playlist.find((playlistSong) => playlistSong.id === currentSong.id)
		);
	});
	return formatSongList(filtered);
};

module.exports = { myApiRecommended };
