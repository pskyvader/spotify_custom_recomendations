require("dotenv").config();
const nockBack = require("nock").back;
const path = require("path");
const { getRecommendedSongs } = require("../spotifyapi/song");
const { User } = require("../database");
const { validateUserLogin } = require("../api/user");

nockBack.fixtures = path.join(__dirname, "nockfixtures");
nockBack.setMode("record");

test("Get a list with random songs", async () => {
	const { nockDone } = await nockBack("randomSongs.json");
	const user = await User.findOne().then((user) => {
		return validateUserLogin({
			hash: user.hash,
			access_token: user.access_token,
			expiration: user.expiration,
		});
	});
	const response = await getRecommendedSongs(
		user.access_token,
		[],
		0,
		user.country
	);
	console.log("RANDOM SONGS", response.length);
	expect(response).toBeDefined();
	expect(response).not.toHaveProperty("error");
	expect(response).not.toHaveLength(0);

	nockDone();
	// return response;
});
