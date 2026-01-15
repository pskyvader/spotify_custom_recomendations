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
		weights = { song: 10, artist: 30, random: 60 }; // less than 50
	} else if (playlistLength < mid) {
		weights = { song: 20, artist: 40, random: 40 }; // between 50 and 125
	} else if (playlistLength <= max) {
		weights = { song: 40, artist: 40, random: 20 }; // between 125 and 200
	} else {
		weights = { song: 50, artist: 40, random: 10 }; // greater than 200
	}
	return weights;
};

const getRandomYear = () => {
	return 1960 + Math.floor(Math.random() * (new Date().getFullYear() - 1960));
};

// Mode 1: Pure Discovery (Completely Random)
const getBlindDiscoveryURL = () => {
	const year = getRandomYear();
	const country = countries[Math.floor(Math.random() * countries.length)];
	const genre = genres[Math.floor(Math.random() * genres.length)];
	
	// 15% chance of 'hipster' tag for hidden gems
	const tag = Math.random() < 0.15 ? " tag:hipster" : "";
	// 15% chance of 'new' tag for fresh releases
	const newTag = Math.random() < 0.15 ? " tag:new" : "";
	
	const q = `year:${year} genre:${genre}${tag}${newTag}`;
	return `https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=track&market=${country}&limit=40`;
};

// Mode 2: Artist Exploration (Based on User's Artists)
const getArtistContextURL = (songlist) => {
	const randomSong = songlist[Math.floor(Math.random() * songlist.length)];
	// Handle "Artist 1, Artist 2" string to get a rigorous search
	const artists = randomSong.artist.split(", ");
	
	// New Strategy: Focus on Collaborators / Featured Artists
	// If there are multiple artists, 50% chance to search specifically for the secondary one
	let selectedArtist = artists[0];
	if (artists.length > 1 && Math.random() > 0.5) {
		selectedArtist = artists[Math.floor(Math.random() * (artists.length - 1)) + 1];
	}

	const r = Math.random();
	let q = "";
	
	if (r < 0.3) {
		// Era Focus: Artist during a specific 5-year window
		const year = getRandomYear(); 
		const yearRange = `${year}-${year+5}`;
		q = `artist:"${selectedArtist}" year:${yearRange}`;
	} else {
		// Broad Artist Search
		q = `artist:"${selectedArtist}"`;
	}
	
	return `https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=track&limit=40`;
};

// Mode 3: Contextual / Song based (Based on User's Tracks)
const getSongContextURL = (songlist) => {
	const randomSong = songlist[Math.floor(Math.random() * songlist.length)];
	const r = Math.random();
	let q = "";
	
	if (r < 0.20 && randomSong.album && randomSong.album !== "") {
		// Album Context: Songs from the same album
		q = `album:"${randomSong.album}"`;
	} else if (r < 0.40) {
		// Title Match: Finds covers, remixes, or same song versions
		q = `track:"${randomSong.name}"`;
	} else if (r < 0.60) {
		// Remix Hunter: Look specifically for remixes of songs you like
		q = `track:"${randomSong.name}" remix`;
	} else {
		// Word Association: Pick a "significant" word from the title to find unrelated songs with connections
		// Filter out short words
		const words = randomSong.name.split(" ").filter(w => w.length > 3);
		if (words.length > 0) {
			const word = words[Math.floor(Math.random() * words.length)];
			// Clean word of special chars
			const cleanWord = word.replace(/[^a-zA-Z0-9]/g, "");
			q = `track:${cleanWord}`;
		} else {
			q = `track:"${randomSong.name}"`;
		}
	}
	return `https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=track&limit=40`;
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

		if (songList.length === 0) {
			url = getBlindDiscoveryURL();
		} else if (randomNumber < weights.song) {
			url = getSongContextURL(songList);
		} else if (randomNumber < weights.song + weights.artist) {
			url = getArtistContextURL(songList);
		} else {
			url = getBlindDiscoveryURL();
		}

		let response = {};
		let responseItems = 0;
		let attempts = 0;
		
		// Try to fetch, with a few retries if we get 0 items (e.g. obscure lucky search)
		while (responseItems === 0 && !response.error && attempts < 3) {
			response = await request(access_token, url);
			attempts++;
			if (response.tracks) {
				responseItems = response.tracks.items
					? response.tracks.items.length
					: response.tracks.length;
			}
			if (responseItems === 0) {
				// Fallback to pure random if specific search failed
				url = getBlindDiscoveryURL();
			}
		}

		// Soft fail: if this group failed, just log and continue to next group
		// instead of failing the entire recommendation batch
		if (response.error) {
			console.log("[WARN] Get recommended songs error for URL:", url, response.message);
			continue;
		}
		
		if (response.tracks && response.tracks.items) {
			recommendedSongs.push(...response.tracks.items);
		}
	}

	// Filter the list of tracks to only include tracks that are available in the user's country
	const filteredTracks = recommendedSongs.filter((track) => {
		if (!track.available_markets) {
			return true;
		}
		return track.available_markets.includes(userCountry);
	});

	// Return unique songs (deduplicate by ID) limited to ~200
	const uniqueTracks = Array.from(new Map(filteredTracks.map(item => [item.id, item])).values());
	
	// Shuffle and limit to 200
	return formatSongGroup(uniqueTracks.sort(() => Math.random() - 0.5).slice(0, 200));
};

module.exports = { getRecommendedSongs };
