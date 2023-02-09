require("dotenv").config();
const nockBack = require("nock").back;
const path = require("path");
const { request } = require("../spotifyapi/");
const { User } = require("../database");

nockBack.fixtures = path.join(__dirname, "nockfixtures");
nockBack.setMode("record");

const url = "https://api.spotify.com/v1/me";
test("Get a response from API", async () => {
	const { nockDone } = await nockBack("basicRequest.json");
	const user = await User.findOne();

	console.log(user.access_token, url);
	const response = await request(user.access_token, url);
	console.log("My profile: ", response);

	expect(response).toBeDefined();
	expect(response).not.toHaveProperty("error");

	nockDone();
	// return response;
});
