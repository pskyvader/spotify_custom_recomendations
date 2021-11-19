import GetRequest from "./Request";

export const Recommended = async (playlists) => {
	console.log(playlists);

	const options = {
		seed_artists:"",
		seed_genres:"classical",
		seed_tracks:""
	}


	const url = "https://api.spotify.com/v1/recommendations";
	let urlOptions = "?";
	Object.entries(options).forEach((option) => {
		urlOptions += option[0] + "=" + option[1] + "&";
	});
	return GetRequest(url + urlOptions);
};
