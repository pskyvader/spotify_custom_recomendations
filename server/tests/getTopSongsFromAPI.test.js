require("dotenv").config();
const { getTopSongs } = require("../spotifyapi/song");
const { getTestUser } = require("./testHelpers");

test("Get a list of Top Songs From Spotify API", () => {
		return getTestUser()
			.then((user) => getTopSongs(user.access_token))
		.then((response) => {
			expect(response).toBeDefined();
			if (response.error) {
				expect(response).toHaveProperty("message");
			} else {
				expect(response).not.toHaveProperty("error");
				expect(response).not.toHaveLength(0);
			}
			// console.log("Top Songs: ", response);
			return response;
		});
});
