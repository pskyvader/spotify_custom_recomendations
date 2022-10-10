require("dotenv").config();
const { updateAverageTimes } = require("../tasks");
const { User } = require("../database");

test("Console render without errors", () => {
	return User.findOne()
		.then((user) => updateAverageTimes(user))
		.then((response) => {
			console.log(response);
			expect(response.error).toBeFalsy();
		});
});

if (require.main === module) {
	averageTimesTest();
}
