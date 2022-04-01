const { request, genres } = require("../../utils");
const { formatSongList } = require("../../model");

const fillOptions = (playlist, topSongs, currentgenres) => {
	const options = {
		seed_artists: [],
		seed_genres: [],
		seed_tracks: [],
		market: "from_token",
	};
	const songs = playlist.length > 0 ? playlist : topSongs;

	if (songs.length > 0) {
		for (let index = 0; index < 5; index++) {
			const idsong = Math.floor(Math.random() * songs.length);
			const randomSong = songs[idsong];
			const randomNumber = Math.floor(Math.random() * 10);
			const randomGenre =
				currentgenres[Math.floor(Math.random() * currentgenres.length)];

			//50%
			if (randomNumber < 5) {
				options.seed_tracks.push(randomSong.id);
				continue;
			}
			//30%
			if (randomNumber < 8) {
				options.seed_artists.push(randomSong.idartist);
				continue;
			}

			//20%
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
	topSongs,
	currentgenres
) => {
	const options = fillOptions(playlist, topSongs, currentgenres || genres);

	const url = "https://api.spotify.com/v1/recommendations";
	let urlOptions = "?";
	Object.entries(options).forEach((option) => {
		urlOptions += option[0] + "=" + option[1] + "&";
	});
	// console.log(url + urlOptions);
	const response = await request(access_token, url + urlOptions);
	if (response.error) {
		return response;
	}

	const filtered = response.tracks.filter((song) => {
		const currentSong = song.track || song;
		return currentSong.is_playable;
	});
	return formatSongList(filtered);
};

module.exports = { myApiRecommended };
