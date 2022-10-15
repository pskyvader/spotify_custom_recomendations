require("dotenv").config();
const { removeFromPlaylist } = require("../tasks");
const { User } = require("../database");

test("Console render without errors", () => {
	const songsToModify = -5;
	const averageResponse = {
		error: false,
		message: [],
		average: 37.793103448275865,
	};
	return User.findOne()
		.then((user) =>
			removeFromPlaylist(user, songsToModify, averageResponse)
		)
		.then((response) => {
			console.log(response);
			expect(response).toHaveProperty("error", false);
			expect(response).toHaveProperty("message");
			expect(response).toHaveProperty("removedTotal");
			// expect(response).toHaveProperty("minTime");
		});
});
