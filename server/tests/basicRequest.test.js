require("dotenv").config();
const nockBack = require("nock").back;
const { request } = require("../spotifyapi/");
const { User } = require("../database");

nockBack.fixtures = "./nockfixtures/";
nockBack.setMode("record");

test("Get a response from API", async () => {
	const { nockDone } = await nockBack("basicRequest.json");

	const url = "https://api.spotify.com/v1/me";
	return User.findOne()
		.then((user) => request(user.access_token, url))
		.then((response) => {
			console.log(response);
			expect(response).toBeDefined();
			expect(response).not.toHaveProperty("error");
			console.log("My profile: ", response);
			nockDone();
			return response;
		});
});
