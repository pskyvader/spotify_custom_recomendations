const { generateRandomString } = require("./utils/generateRandomString");
const { credentials } = require("./credentials");
console.log(credentials)
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
var scope = permissions.join(" ");

const login = (req, res) => {
	var state = generateRandomString(16);

	res.redirect(
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

module.exports = { login };
