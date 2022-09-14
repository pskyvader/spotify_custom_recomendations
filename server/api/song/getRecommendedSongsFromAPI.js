const { request, genres, formatSongAPIList } = require("../../utils");

const fillOptions = (songlist, currentgenres) => {
	const options = {
		seed_artists: [],
		seed_genres: [],
		seed_tracks: [],
		market: "from_token",
	};

	if (songlist.length > 0) {
		const half_songlist = Math.floor((songlist.length - 1) / 2);
		for (let index = 0; index < 5; index++) {
			const idsong = Math.floor(Math.random() * half_songlist);
			const randomSong = songlist[idsong];
			const randomNumber = Math.floor(Math.random() * 100);

			if (randomNumber < 60) {
				options.seed_tracks.push(randomSong.id);
				// console.log(`Seed track ${randomSong.id} ${randomSong.name}`);
				continue;
			}
			if (randomNumber < 90) {
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
	currentgenres = genres
) => {
	const options = fillOptions(songList, currentgenres);

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
		//song playable and not in songlist
		return currentSong.is_playable;
	});
	return formatSongAPIList(filtered);
};

module.exports = { getRecommendedSongsFromAPI };
