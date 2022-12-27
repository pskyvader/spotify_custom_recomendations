const { generateRandomString } = require("../../utils/generateRandomString");
const { credentials } = require("../../credentials");
// your application requests authorization
const permissions = [
	// "user-read-private",
	"user-top-read",
	"user-read-recently-played",
	// "user-read-email",
	// "playlist-read-collaborative",
	"playlist-read-private",
	"playlist-modify-public",
	"playlist-modify-private",
];
const scope = permissions.join(" ");

const getAuthorizationURL = () => {
	const state = generateRandomString(16);
	return (
		"https://accounts.spotify.com/authorize?" +
		new URLSearchParams({
			response_type: "code",
			client_id: credentials.client_id,
			scope: scope,
			redirect_uri: credentials.redirect_uri,
			state: state,
		})
	);
};

module.exports = { getAuthorizationURL };
