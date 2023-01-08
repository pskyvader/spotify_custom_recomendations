const formatUser = (
	rawData,
	extraData = { access_token, refresh_token, expiration, hash }
) => {
	console.log("rawdata", rawData);
	console.log("extraData", extraData);
	return {
		id: rawData.id,
		name: rawData.display_name,
		url: rawData.external_urls.spotify,
		image: rawData.images[0].url,
		country: rawData.country,
		access_token: extraData.access_token,
		refresh_token: extraData.refresh_token,
		expiration: extraData.expiration,
		hash: extraData.hash,
	};
};

module.exports = { formatUser };
