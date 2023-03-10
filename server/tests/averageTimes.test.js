require("dotenv").config();
const { updateAverageTimes } = require("../tasks");
const { User } = require("../database");
const { validateUserLogin } = require("../api/user");

test("Get Average times with no console errors, and defined average number", () => {
	return User.findOne()
		.then((user) => {
			return validateUserLogin(user);
		})
		.then((user) => {
			console.log(user);
			return updateAverageTimes(user);
		})
		.then((response) => {
			expect(response).toHaveProperty("error", false);
			expect(response).toHaveProperty("message");
			expect(response).toHaveProperty("average");
			expect(response.average).not.toBeNaN();
			// expect(response).toHaveProperty("minTime");
			console.log("Average Number: ", response.average);
			return response;
		});
});
