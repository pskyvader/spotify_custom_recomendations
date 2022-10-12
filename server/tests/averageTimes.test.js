require("dotenv").config();
const { updateAverageTimes } = require("../tasks");
const { User, UserSongHistory } = require("../database");

test("Console render without errors", () => {
	console.log(new UserSongHistory());
	return User.findOne()
		.then((user) => updateAverageTimes(user))
		.then((response) => {
			console.log(response);
			expect(response).toHaveProperty("error", false);
			expect(response).toHaveProperty("message");
			expect(response).toHaveProperty("dates");
			expect(response).toHaveProperty("total_times");
			expect(response).toHaveProperty("average");
		});
});

if (require.main === module) {
	averageTimesTest();
}
