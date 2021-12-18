const { request, genres, formatSongList } = require("../utils");

const fillOptions = (playlist, topSongs, currentgenres) => {
	const options = {
		seed_artists: [],
		seed_genres: [],
		seed_tracks: [],
	};
	const songs = playlist.length > 0 ? playlist : topSongs;

	if (songs.length > 0) {
		for (let index = 0; index < 5; index++) {
			const idsong = Math.floor(Math.random() * songs.length);
			const currentSong = songs[idsong];
			switch (Math.floor(Math.random() * 3)) {
				case 0:
					options.seed_artists.push(currentSong.artistid);
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

const recommended = async (req, playlist, topSongs, currentgenres) => {
	const options = fillOptions(playlist, topSongs, currentgenres || genres);

	const url = "https://api.spotify.com/v1/recommendations";
	let urlOptions = "?";
	Object.entries(options).forEach((option) => {
		urlOptions += option[0] + "=" + option[1] + "&";
	});
	const response = await request(req, url + urlOptions);
	if (response.error) {
		return response;
	}

	return formatSongList(response.tracks);
};

module.exports = { recommended };
