require("dotenv").config();
const { getTopSongs } = require("../spotifyapi/song");
const { User } = require("../database");

test("Get a list of Top Songs From Spotify API", () => {
	return User.findOne()
		.then((user) => getTopSongs(user.access_token))
		.then((response) => {
			expect(response).toBeDefined();
			expect(response).not.toHaveProperty("error");
			console.log("Recommended Songs: ", response);
			return response;
		});
});
