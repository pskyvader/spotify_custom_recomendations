import GetRequest from "./Request";

export const Recommended = async (options={}) => {
	const url = "https://api.spotify.com/v1/recommendations/";
	return GetRequest(url,"GET",JSON.stringify(options));
};