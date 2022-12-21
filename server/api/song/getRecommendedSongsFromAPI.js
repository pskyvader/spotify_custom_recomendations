const { request, genres, formatSongAPIList } = require("../../utils");

const getWeights = (playlistLength) => {
	const min = process.env.MIN_SONGS_PER_PLAYLIST;
	const max = process.env.MAX_SONGS_PER_PLAYLIST;
	const mid = min + Math.floor((max - min) / 2);

	let weights = [50, 80]; //mid<n<max
	if (playlistLength > max) {
		weights = [60, 90];
	}
	if (playlistLength < mid) {
		//min<n<mid
		weights = [20, 30];
	}
	if (playlistLength < min) {
		weights = [10, 20];
	}
	return weights;
};

const fillOptions = (songlist, currentgenres, weights) => {
	const options = {
		seed_artists: [],
		seed_genres: [],
		seed_tracks: [],
		// market: "from_token",
		limit: 40,
	};

	if (songlist.length > 0) {
		const half_songlist = Math.floor((songlist.length - 1) / 2);
		for (let index = 0; index < 5; index++) {
			const idsong = Math.floor(Math.random() * half_songlist);
			const randomSong = songlist[idsong];
			const randomNumber = Math.floor(Math.random() * 100);

			if (randomNumber < weights[0]) {
				options.seed_tracks.push(randomSong.id);
				// console.log(`Seed track ${randomSong.id} ${randomSong.name}`);
				continue;
			}
			if (randomNumber < weights[1]) {
				options.seed_artists.push(randomSong.idartist);
				// console.log(
				// 	`Seed artist ${randomSong.idartist} ${randomSong.artist}`
				// );
				continue;
			}

			const randomGenre =
				currentgenres[
					Math.floor(Math.random() * (currentgenres.length - 1))
				];
			// console.log(`Seed genre ${randomGenre}`);
			options.seed_genres.push(randomGenre);
		}
	} else {
		options.seed_genres.push(
			currentgenres[Math.floor(Math.random() * currentgenres.length)]
		);
	}

	return options;
};

const getRecommendedSongsFromAPI = async (
	access_token,
	songList,
	playlistLength,
	currentgenres = genres
) => {
	const weights = getWeights(playlistLength);
	const options = fillOptions(songList, currentgenres, weights);

	console.log(
		"Generating seeds",
		",songs:",
		playlistLength,
		",weights:",
		JSON.stringify(weights),
		",options:",
		JSON.stringify(options)
	);

	const url = "https://api.spotify.com/v1/recommendations";
	let urlOptions = "?";

	for (const key in options) {
		if (Object.hasOwnProperty.call(options, key)) {
			const option = options[key];
			if (Array.isArray(option)) {
				if (option.length > 0) {
					urlOptions += `${key}=${option.join(",")}&`;
				}
			} else if (option !== "" && option !== undefined) {
				urlOptions += `${key}=${option}&`;
			}
		}
	}

	const response = await request(access_token, url + urlOptions);
	if (response.error) {
		return response;
	}

	// const filtered = response.tracks.filter((song) => {
	// 	const currentSong = song.track || song;
	// 	//song playable
	// 	return currentSong.is_playable;
	// });
	const filtered = response.tracks;

	return formatSongAPIList(filtered);
};

module.exports = { getRecommendedSongsFromAPI };
