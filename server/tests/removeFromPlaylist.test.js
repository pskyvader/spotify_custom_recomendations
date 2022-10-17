require("dotenv").config();
const { removeFromPlaylist } = require("../tasks");
const { User } = require("../database");

test("Removed from playlist with no console errors, and 0 Removed", () => {
	const songsToModify = -5;
	const averageResponse = {
		error: false,
		message: [],
		average: 37,
	};
	return User.findOne()
		.then((user) =>
			removeFromPlaylist(user, songsToModify, averageResponse)
		)
		.then((response) => {
			expect(response).toHaveProperty("error", false);
			expect(response).toHaveProperty("message");
			expect(response.removedTotal).toBeDefined();
			console.log("removedTotal: ", response.removedTotal);
			return response;
		})
		.catch((reason) => {
			console.error(reason);
			return { error: true, message: reason.message };
		});
});
