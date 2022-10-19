require("dotenv").config();
const { getTopSongsFromAPI } = require("../api/song");
const { User } = require("../database");

test("Get a list of Top Songs From Spotify API", () => {
	return User.findOne()
		.then((user) => getTopSongsFromAPI(user))
		.then((response) => {
			expect(response).toBeDefined();
			expect(response).not.toHaveProperty("error");
			console.log("Recommended Songs: ", response);
			return response;
		});
});
