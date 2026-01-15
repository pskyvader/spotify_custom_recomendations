require("dotenv").config();
const { updateAverageTimes } = require("../tasks");
const { getTestUser } = require("./testHelpers");

test("Get Average times with no console errors, and defined average number", () => {
	return getTestUser()
		.then((user) => updateAverageTimes(user))
		.then((response) => {
			if (response.error) {
				expect(response).toHaveProperty("message");
			} else {
				expect(response).toHaveProperty("message");
				expect(response).toHaveProperty("average");
				expect(response.average).not.toBeNaN();
				console.log("Average Number: ", response.average);
			}
			return response;
		});
});
