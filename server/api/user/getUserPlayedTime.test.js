require("dotenv").config();
const { User } = require("../../database");
const { validateUserLogin } = require("../user");
const { getTestUser } = require("../../tests/testHelpers");
const { getUserPlayedTime } = require("./getUserPlayedTime");

describe("getUserPlayedTime", () => {
	test("returns object with played and total properties", () => {
		return getTestUser()
			.then((user) => getUserPlayedTime(user))
			.then((response) => {
				expect(response).toBeDefined();
				if (response.error) {
					expect(response).toHaveProperty("message");
				} else {
					expect(response).not.toHaveProperty("error");
				}
				return response;
			});
	});

	test("returns error message if getUserSongHistories throws an error", () => {
		const user = {
			id: 1,
			getUserSongHistories: jest
				.fn()
				.mockRejectedValue(new Error("Database connection test error")),
		};

		return getUserPlayedTime(user).then((response) => {
			expect(response).toEqual({
				error: true,
				message: "Database connection test error",
			});
		});
	});
});
