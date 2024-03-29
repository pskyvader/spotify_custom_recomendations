require("dotenv").config();
const { addToPlaylist } = require("../tasks");
const { User } = require("../database");
const { validateUserLogin } = require("../api/user");

test("Add to playlist with no console errors, and 0 added", () => {
	const songsToModify = -5;
	const averageResponse = {
		error: false,
		message: [],
		average: 37,
	};
	return User.findOne()
		.then((user) => {
			return validateUserLogin({
				hash: user.hash,
				access_token: user.access_token,
				expiration: user.expiration,
			});
		})
		.then((user) => {
			return addToPlaylist(user, songsToModify, {}, averageResponse);
		})
		.then((response) => {
			expect(response).toHaveProperty("error", false);
			expect(response).toHaveProperty("message");
			expect(response.addedTotal).toBeDefined();
			// console.log("addedTotal: ", response.addedTotal);
			return response;
		});
});
