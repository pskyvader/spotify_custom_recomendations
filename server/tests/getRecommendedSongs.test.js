require("dotenv").config();
const { getRecommendedSongs } = require("../api/song");
const { User } = require("../database");
const { validateUserLogin } = require("../api/user");

test("Get a list of recommended Songs", () => {
	const minTime = parseInt(200 / 37 || 1);
	return User.findOne()
		.then((user) => {
			return validateUserLogin({
				hash: user.hash,
				access_token: user.access_token,
				expiration: user.expiration,
			});
		})
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
			expect(response).not.toHaveLength(0);
			// console.log("Recommended Songs: ", response);
			return response;
		});
});
