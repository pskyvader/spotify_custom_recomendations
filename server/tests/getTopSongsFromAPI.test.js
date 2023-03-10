require("dotenv").config();
const { getTopSongs } = require("../spotifyapi/song");
const { User } = require("../database");
const { validateUserLogin } = require("../api/user");

test("Get a list of Top Songs From Spotify API", () => {
	return User.findOne()
		.then((user) => {
			return validateUserLogin({
				hash: user.hash,
				access_token: user.access_token,
				expiration: user.expiration,
			});
		})
		.then((user) => getTopSongs(user.access_token))
		.then((response) => {
			expect(response).toBeDefined();
			expect(response).not.toHaveProperty("error");
			expect(response).not.toHaveLength(0);
			// console.log("Top Songs: ", response);
			return response;
		});
});
