const { genres } = require("./genres");
const { countries } = require("./countries");
const { request } = require("../");
const { formatSongGroup } = require("./formatSong");

const getWeights = (playlistLength) => {
	const min = process.env.MIN_SONGS_PER_PLAYLIST; //200
	const max = process.env.MAX_SONGS_PER_PLAYLIST; //50
	const mid = min + Math.floor((max - min) / 2); //125
	let weights;
	if (playlistLength < min) {
		weights = { song: 10, artist: 20, random: 70 }; // less than 50
	} else if (playlistLength < mid) {
		weights = { song: 20, artist: 30, random: 50 }; // between 50 and 125
	} else if (playlistLength <= max) {
		weights = { song: 40, artist: 30, random: 30 }; // between 125 and 200
	} else {
		weights = { song: 60, artist: 30, random: 10 }; // greater than 200
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
	const index = Math.floor(Math.random() * half_songlist);
	const randomSong = songlist[index];
	const url = "https://api.spotify.com/v1/recommendations";
	const urlOptions = `?seed_tracks=${randomSong.id}&limit=10`;
	return url + urlOptions;
};
const getRandomArtistURL = (songlist) => {
	const half_songlist = Math.floor((songlist.length - 1) / 2);
	const index = Math.floor(Math.random() * half_songlist);
	const randomSong = songlist[index];
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

		if (randomNumber < weights.song) {
			url = getRandomSongURL(songList);
		} else if (randomNumber < weights.song + weights.artist) {
			url = getRandomArtistURL(songList);
		} else {
			url = getRandomURL();
			console.log("random url", url);
		}
		const response = await request(access_token, url);

		if (randomNumber > weights.song + weights.artist) {
			console.log("random url response", response);
		}

		if (response.error) {
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
