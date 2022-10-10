require("dotenv").config();
const { updateAverageTimes } = require("../tasks");
const { User } = require("../database");

test("Console render without errors", () => {
	return User.findOne()
		.then((user) => updateAverageTimes(user))
		.then((response) => {
			console.log(response);
			expect(response).toHaveReturnedWith(
				expect.objectContaining({
					error: expect(false),
					message: expect.any(Array),
					dates: expect.any(Number),
					total_times: expect.any(Number),
					average: expect.any(Number),
				})
			);
		});
});

if (require.main === module) {
	averageTimesTest();
}
