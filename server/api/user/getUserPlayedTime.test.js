require("dotenv").config();
const { User } = require("../../database");
const { validateUserLogin } = require("../user");
const { getUserPlayedTime } = require("./getUserPlayedTime");

describe("getUserPlayedTime", () => {
	test("returns object with played and total properties", () => {
		return User.findOne()
			.then((user) => {
				return validateUserLogin({
					hash: user.hash,
					access_token: user.access_token,
					expiration: user.expiration,
				});
			})
			.then((user) => {
				return getUserPlayedTime(user);
			})
			.then((response) => {
				expect(response).toBeDefined();
				expect(response).not.toHaveProperty("error");
				// console.log(response);
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
