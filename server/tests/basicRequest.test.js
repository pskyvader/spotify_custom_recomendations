require("dotenv").config();
const { request } = require("../spotifyapi/");
const { User } = require("../database");

test("Get a response from API", () => {
	const url = "https://api.spotify.com/v1/me";
	return User.findOne()
		.then((user) => request(user.access_token, url))
		.then((response) => {
			console.log(response);
			expect(response).toBeDefined();
			expect(response).not.toHaveProperty("error");
			console.log("My profile: ", response);
			return response;
		});
});
