require("dotenv").config();
const { getRecommendedSongs } = require("../api/song");
const { getTestUser } = require("./testHelpers");

test("Get a list of recommended Songs", () => {
	const minDays = parseInt(200 / 37 || 1);
	return getTestUser()
		.then((user) =>
			user && user.getPlaylists
				? user.getPlaylists({ where: { active: true } }).then((playlists) => getRecommendedSongs(user, playlists[0], minDays))
				: getRecommendedSongs(user, null, minDays)
		)
		.then((response) => {
			if (response && response.error) {
				expect(response).toHaveProperty("message");
			} else {
				expect(response).toBeDefined();
				expect(response).not.toHaveProperty("error");
				expect(response).not.toHaveLength(0);
			}
			return response;
		});
});
