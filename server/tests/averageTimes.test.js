require("dotenv").config();
const { updateAverageTimes } = require("../tasks");
const { User } = require("../database");

test("Get Average times with no console errors, and defined average number", () => {
	return User.findOne()
		.then((user) => updateAverageTimes(user))
		.then((response) => {
			console.log(response.average);
			expect(response).toHaveProperty("error", false);
			expect(response).toHaveProperty("message");
			expect(response).toHaveProperty("average");
			expect(response.average).not.toBeNaN();
			// expect(response).toHaveProperty("minTime");
			return response;
		});
});
