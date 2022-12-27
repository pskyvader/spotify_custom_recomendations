const { request } = require("../");

const getUser = (access_token) => {
	return request(access_token, "https://api.spotify.com/v1/me");
};

module.exports = { getUser };
