require("dotenv").config();
const nockBack = require("nock").back;
const path = require("path");
const { getRecommendedSongs } = require("../spotifyapi/song");
const { User } = require("../database");
const { validateUserLogin } = require("../api/user");

nockBack.fixtures = path.join(__dirname, "nockfixtures");
nockBack.setMode("record");

test("Get a list with random songs", async () => {
	const { nockDone } = await nockBack("basicRequest.json");
	const user = await User.findOne().then((user) => {
		return validateUserLogin(user);
	});
	const response = await getRecommendedSongs(
		user.access_token,
		[],
		0,
		user.country
	);
	console.log(response);

	expect(response).toBeDefined();
	expect(response).not.toHaveProperty("error");

	nockDone();
	// return response;
});
