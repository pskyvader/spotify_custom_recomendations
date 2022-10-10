require("dotenv").config();
const { updateAverageTimes } = require("../tasks");
const { User } = require("../database");

test("Console render without errors", () => {
	User.findOne()
		.then((user) => updateAverageTimes(user))
		.then((response) => {
			console.log(response);
			return response.error;
		})
		.finally((r) => {
			expect(r).toBeFalsy();
		});
});

if (require.main === module) {
	averageTimesTest();
}
