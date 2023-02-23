const { genres } = require("./genres");
const { countries } = require("./countries");
const { request } = require("../");
const { formatSongGroup } = require("./formatSong");

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

const getRandomURL = () => {
	// Generate a random year between 1950 and the current year
	const randomYear =
		1950 + Math.floor(Math.random() * (new Date().getFullYear() - 1950));
	const randomCountry =
		countries[Math.floor(Math.random() * countries.length)];
	const randomGenre = genres[Math.floor(Math.random() * genres.length)];

	const url = "https://api.spotify.com/v1/search";
	const urlOptions = `?q=year:${randomYear}%20country:${randomCountry}%20genre:${randomGenre}&type=track&limit=10`;
	return url + urlOptions;
};
const getRandomSongURL = (songlist) => {
	const half_songlist = Math.floor((songlist.length - 1) / 2);
	const idsong = Math.floor(Math.random() * half_songlist);
	const url = "https://api.spotify.com/v1/recommendations";
	const urlOptions = `?seed_tracks=${idsong}&limit=10`;
	return url + urlOptions;
};
const getRandomArtistURL = (songlist) => {
	const half_songlist = Math.floor((songlist.length - 1) / 2);
	const idsong = Math.floor(Math.random() * half_songlist);
	const randomSong = songlist[idsong];
	const url = "https://api.spotify.com/v1/recommendations";
	const urlOptions = `?seed_artists=${randomSong.idartist}&limit=10`;
	return url + urlOptions;
};

const getRecommendedSongs = async (
	access_token,
	songList,
	playlistLength,
	userCountry,
	groups = 5
) => {
	const weights = getWeights(playlistLength);

	const recommendedSongs = [];
	for (let i = 0; i < groups; i++) {
		const randomNumber = Math.floor(Math.random() * 100);
		let url = "";

		if (randomNumber < weights[0]) {
			url = getRandomSongURL(songList);
		} else if (randomNumber < weights[1]) {
			url = getRandomArtistURL(songList);
		} else {
			url = getRandomURL();
		}

		const response = await request(access_token, url);
		if (response.error) {
			console.log("Get recommended songs from API error", response);
			return response;
		}
		recommendedSongs.push(...(response.tracks.items || response.tracks));
	}

	// Filter the list of tracks to only include tracks that are available in the user's country
	const filteredTracks = recommendedSongs.filter((track) =>
		track.available_markets.includes(userCountry)
	);

	return formatSongGroup(filteredTracks.sort(() => Math.random() - 0.5));
};

module.exports = { getRecommendedSongs };
