require("dotenv").config();
const { getRecommendedSongs } = require("../api/song");
const { User } = require("../database");

test("Get a list of recommended Songs", () => {
	const minTime = parseInt(200 / 37 || 1);
	return User.findOne()
		.then((user) => {
			return user
				.getPlaylists({ where: { active: true } })
				.then((playlists) => {
					return { user, playlists };
				});
		})
		.then(({ user, playlists }) =>
			getRecommendedSongs(user, playlists[0], minTime)
		)
		.then((response) => {
			expect(response).toBeDefined();
			expect(response).not.toHaveProperty("error");
			console.log("Recommended Songs: ", response);
			return response;
		});
});
