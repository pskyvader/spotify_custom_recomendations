const { request } = require("../");
const { formatUser } = require("./formatUser");

const getUser = (access_token, extraData) => {
	return request(access_token, "https://api.spotify.com/v1/me").then(
		(response) => {
			if (response.error) {
				console.log("Get user from API error", response);
				return response;
			}
			return formatUser(response, extraData);
		}
	);
};

module.exports = { getUser };
