const { generateRandomString } = require("./utils/generateRandomString");
const { credentials } = require("./credentials");
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

const login = (req, res) => {
	const return_value = req.query.return || null;
	const state = generateRandomString(16);
	const url =
		"https://accounts.spotify.com/authorize?" +
		new URLSearchParams({
			response_type: "code",
			client_id: credentials.client_id,
			scope: scope,
			redirect_uri: credentials.redirect_uri,
			state: state,
		});
	if (return_value) {
		res.json({ url: url });
		return;
	}
	res.redirect(url);
};

module.exports = { login };
