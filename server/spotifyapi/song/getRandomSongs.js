const { request } = require("../");
const genres = require("./genres");
const countries = require("./countries");
const { formatSongGroup } = require("./formatSong");
function getRandomParams() {
	// Generate a random year between 1950 and the current year
	const randomYear =
		1950 + Math.floor(Math.random() * (new Date().getFullYear() - 1950));
	// Get a random country from the list of countries
	const randomCountry =
		countries[Math.floor(Math.random() * countries.length)];
	// Get a random genre from the list of genres
	const randomGenre = genres[Math.floor(Math.random() * genres.length)];

	// Return an object with the random year, country, and genre
	return {
		year: randomYear,
		country: randomCountry,
		genre: randomGenre,
	};
}

const getRandomSongs = async (access_token, userCountry) => {
	// Get the random year, country, and genre
	const params = getRandomParams();
	// Set up the base URL for the Spotify API's search function
	const url = "https://api.spotify.com/v1/search";

	// Set up the query string with the random year, country, and genre
	const urlOptions = `?q=year:${params.year}%20country:${params.country}%20genre:${params.genre}&type=track`;

	const response = await request(access_token, url + urlOptions);
	if (response.error) {
		console.log("Get random songs from API error", response);
		return response;
	}
	const tracks = response.tracks.items;

	// Filter the list of tracks to only include tracks that are available in the user's country
	const filteredTracks = tracks.filter((track) =>
		track.available_markets.includes(userCountry)
	);
	return formatSongGroup(filteredTracks);
};

module.exports = {
	getRandomSongs,
};
